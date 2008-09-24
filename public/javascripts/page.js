// The main tilswiki javascript module, concerned with core functionality
// edit, autosave etc.

var $tw = function() {
  var tw = {};
  var editing = true;

  tw.putContent = function() {
    var successCallback = function(data, textStatus) {
      // Only run the callback when no other ajax call has been started later
      if ($('.progress').data('allowedSuccessCallback') === successCallback) {
        tw.progressSaved();
      }
    };

    tw.progressSaving();

    $('.progress').data('allowedSuccessCallback', successCallback);

    tw.rememberSavedContent();

    $.ajax({
             url:     '/' + document.location.toString().split('/').pop(),
             data:    { content: wysiwyg.html() },
             type:    'PUT',
             'success': successCallback
           });
  };

  tw.rememberSavedContent = function() {
    var wysiwyg = $('#wysiwyg');
    wysiwyg.data('content', wysiwyg.html());
  };

  tw.putContentIfIdle = function() { };

  tw.putContentIfIdle = function() {
    var last_changed_time = $('#wysiwyg').data('last_changed_time');

    if (last_changed_time && (new Date()).getTime() > last_changed_time + 1 * 1000) {
      $('#wysiwyg').removeData('last_changed_time');
      tw.putContent();
    }

    setTimeout(tw.putContentIfIdle, 1000);
  };

  /*
   * Functions that update the progress indicator area
   */
  tw.progressUnsaved = function() {
    $('.progress').
      data('unsaved_at', (new Date()).getTime()).
      html('<span class="unsaved">changed</span>');
  };
  tw.progressSaving = function() {
    $('.progress').
      data('saving_at', (new Date()).getTime()).
      html('<img src="/images/ajax-loader.gif" /><span>saving...</span>');
  };
  tw.progressSaved = function() {
    var progress = $('.progress');
    var childrenToFadeOut;

    if (
      !progress.data('unsaved_at')
    ||
      progress.data('saving_at') > progress.data('unsaved_at')
    ) {
      progress.html('<img src="/images/ajax-loader-still.gif" /><span>saved</span>');

      childrenToFadeOut = progress.children();

      setTimeout(function() {
        childrenToFadeOut.fadeOut('slow');
      }, 1000);
    }
  };

  tw.suspendEditing = function() {
    editing = false;
  };
  tw.resumeEditing = function() {
    editing = true;
    tw.checkIfDirty();
  };

  // Call this whenever content may have changed
  tw.checkIfDirty = function() {
    var wysiwyg = $("#wysiwyg");

    if (!editing) { return; }

    if (wysiwyg.data('content') !== wysiwyg.html()) {
      wysiwyg.data('last_changed_time', (new Date()).getTime());
      tw.progressUnsaved();
    }
  };

  tw.imageUploadSuccess = function(data) {
    $(data).find('ul li.asset').each(function() {
      $('#wysiwyg').append($('div.image', this)).append('<br/>');
    });

    tb_remove(); // close thickbox

    tw.activateImageEvents();

    tw.checkIfDirty();
  };

  tw.activateImageEvents = function() {
    $('#wysiwyg div.image').
      attr('contenteditable', false).
      bind('mouseenter', function() {
        //var panel = $('<div class="imagePanel">X</div>');
        //panel.css({
        //  position: 'absolute',
        //  top: $(this).offset().top - 25,
        //  height: 25,
        //  left: $(this).offset().left,
        //  width: $(this).width() - 2,
        //  'border-bottom': 'none'
        //});


        var resizeCorner = $('<div class="resizeCorner"></div>');

        resizeCorner.
          css({
            position : 'absolute',
            top      : $(this).offset().top + $(this).height() - 24,
            left     : $(this).offset().left + $(this).width() - 25,
            'z-index': 100
          }).
          mousedown(function() {
            // Resize start
            tw.suspendEditing();
            $('body').css('cursor', 'se-resize');

            var imageContainer = $(this).parent();
            var currentImage   = $('img.current', imageContainer);

            var resizeFrame = $('<div class="resizeFrame"></div>');
            resizeFrame.css({
              top   : currentImage.offset().top,
              left  : currentImage.offset().left,
              width : currentImage.width(),
              height: currentImage.height()
            });
            $('body').append(resizeFrame);

            var images = $('img', imageContainer);
            var thresholdsX = Array();
            var thresholdsY = Array();
            for (var i = 0; i < images.length; i++) {
              if (images[i+1]) {
                thresholdsX.push(
                  imageContainer.offset().left + images[i].width + (images[i+1].width - images[i].width)/2
                );
                thresholdsY.push(
                  imageContainer.offset().top + images[i].height + (images[i+1].height - images[i].height)/2
                );
              }
            }

            $(document).
              mousemove(function(mouseEvent) {
                var idx = 0;
                for (var i = 0; i < thresholdsX.length; i++) {
                  if (mouseEvent.pageX < thresholdsX[i] && mouseEvent.pageY < thresholdsY[i]) {
                    break;
                  }
                  idx++;
                }
                if (images[idx].width != resizeFrame.width()) {
                  resizeFrame.css({
                    width : images[idx].width,
                    height: images[idx].height
                  });
                }
                return false;
              }).
              one('mouseup', function() {
                $(document).unbind('mousemove');

                $('img', imageContainer).
                  removeClass('current').
                  filter('[width=' + resizeFrame.width() + ']').
                  addClass('current');

                resizeFrame.remove();
                resizeCorner.remove();
                $('body').css('cursor', '');

                tw.resumeEditing();
              });

            return false;
          });

        $(this).append(resizeCorner);
      }).
      bind('mouseleave', function() {
        if (!editing) { return; }

        $('.imagePanel, .resizeCorner').remove();
      });
  };

  return tw;
}();


$(function() {
  wysiwyg = $('#wysiwyg');

  wysiwyg.bind("keyup mouseup", $tw.checkIfDirty);

  // Preload progress indicator images
  var preloaded_images = { loader: $('<img />').attr('src', "/images/ajax-loader.gif"),
                           still:  $('<img />').attr('src', "/images/ajax-loader-still.gif") };

  $.each(
    ['bold', 'italic', 'insertHorizontalRule',
     'increaseFontSize', 'decreaseFontSize'],
    function() {
      var cmd = this.toString();
      $('.panel a.' + cmd).mousedown(function() {
        document.execCommand(cmd, false, []);
        return false;
      });
    }
  );

  $('.panel a.colorRed').mousedown(function() {
    document.execCommand('forecolor', false, '#ff1111');
    return false;
  });
  $('.panel a.colorGreen').mousedown(function() {
    document.execCommand('forecolor', false, '#00aa00');
    return false;
  });
  $('.panel a.colorBlue').mousedown(function() {
    document.execCommand('forecolor', false, '#1111ff');
    return false;
  });

  // Bind heading commands. To support non-firefox, this should
  // call "formatBlock Heading 1" instead
  $.each(
    ['h1', 'h2', 'h3'],
    function() {
      var cmd = this.toString();
      $('.panel a.' + cmd).mousedown(function() {
        document.execCommand('heading', false, cmd);
        return false;
      });
    }
  );

  $('.panel a').mousedown($tw.checkIfDirty);

  $('#imageUpload form').ajaxForm({ dataType: 'xml', success: $tw.imageUploadSuccess });

  $tw.rememberSavedContent();
  $tw.putContentIfIdle();

  $('#imageUpload a.cancel').click(function() {
    tb_remove();
    return false;
  });

  $('#imageUpload p.more a').click(function() {
    for (i = 0; i < 3; i++) {
      $(this).parent().before('<input type="file" name="files[]" /><br />');
    }
    return false;
  });

  $tw.activateImageEvents();

});
