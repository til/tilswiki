// The main tilswiki javascript module, concerned with core functionality
// edit, autosave etc.

var $tw = function() {
  var tw = {};
  var editing = true;

  tw.pageUrl = function() {
    return '/' + document.location.toString().split('/').pop();
  };

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
             url:     tw.pageUrl(),
             data:    { body: tw.currentContent() },
             type:    'PUT',
             'success': successCallback
           });
  };

  tw.rememberSavedContent = function() {
    tw.wysiwyg.data('content', tw.wysiwyg.html());
  };

  tw.putContentIfIdle = function() { };

  tw.putContentIfIdle = function() {
    var last_changed_time = tw.wysiwyg.data('last_changed_time');

    if (last_changed_time && (new Date()).getTime() > last_changed_time + 1 * 1000) {
      tw.wysiwyg.removeData('last_changed_time');
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
    tw.wysiwyg.attr('contenteditable', false);
    editing = false;
  };
  tw.resumeEditing = function() {
    editing = true;
    tw.wysiwyg.attr('contenteditable', true);
    tw.checkIfDirty();
  };

  // Call this whenever content may have changed
  tw.checkIfDirty = function() {
    if (!editing) { return; }

    if (tw.wysiwyg.data('content') !== tw.wysiwyg.html()) {
      tw.wysiwyg.data('last_changed_time', (new Date()).getTime());
      tw.progressUnsaved();
    }
  };

  tw.pollForNewContent = function() {
    console.log("polling");
    $.ajax({
      url        : tw.pageUrl(),
      ifModified : true,
      'success'  : function(data, status) {
        tw.wysiwyg.html(diffString(tw.currentContent(), data));
      }
    });

    setTimeout(tw.pollForNewContent, 5000);
  };

  tw.currentContent = function() {
    return tw.wysiwyg.html().
      replace('<ins>', '').replace('</ins>', '').
      replace(/<del>.*?<\/del>/, '');
  };

  tw.imageUploadSuccess = function(data) {
    $(data).find('ul li.asset').each(function() {
      tw.wysiwyg.append($('div.image', this)).append('<br/>');
    });

    tb_remove(); // close thickbox

    tw.activateImageEvents();

    tw.checkIfDirty();
  };

  tw.activateImageEvents = function() {
    $('div.image', tw.wysiwyg).
      attr('contenteditable', false).
      bind('mouseenter', function() {
        var imageContainer = $(this);

        var titleBar = $('<div class="titleBar"></div>').
          attr('contenteditable', false).
          css({
            position: 'absolute',
            top: $(this).offset().top - 25,
            height: 25,
            left: $(this).offset().left,
            width: $(this).width() - 2,
            'border-bottom': 'none'
          }).
          mousedown(function() {
            // Drag start
            tw.suspendEditing();

            var dropTarget = $('<div class="dropTarget"></div>').
              css({
                width: tw.wysiwyg.width(),
                left:  tw.wysiwyg.offset().left
              });

            $('body').
              css('cursor', 'move').
              append(dropTarget);

            var targetElements = $('h1, h2, h3, br, div.image, p', tw.wysiwyg);
            var targets = targetElements.map(function() {
              return $(this).position().top + 2;
            }).get().sort(function(a, b) { return a - b; });
            //console.log("targets: " + targets);

            $(document).
              mousemove(function(mouseEvent) {
                var idx;
                for (idx = 0; idx < targets.length-1; idx++) {
                  if (mouseEvent.pageY < targets[idx] + (targets[idx+1] - targets[idx]) / 2) {
                    break;
                  }
                }
                if (dropTarget.position().top != targets[idx]) {
                  dropTarget.css('top', targets[idx]);
                }
                return false;
              }).
              one('mouseup', function() {
                // Drop
                $(document).unbind('mousemove');
                $('body').css('cursor', '');
                $('.titleBar, .resizeCorner').remove();

                var closest;
                targetElements.each(function() {
                  var that = $(this);
                  if (closest) {
                    if (Math.abs(dropTarget.position().top - that.position().top) <
                        Math.abs(dropTarget.position().top - closest.position().top)) {
                      closest = that;
                    }
                  } else {
                    closest = that;
                  }
                });
                imageContainer.remove();
                closest.before(imageContainer);

                dropTarget.remove();
                tw.resumeEditing();
                tw.activateImageEvents();
                return false;
              });
            return false;
          });
        $(this).append(titleBar);

        var resizeCorner = $('<div class="resizeCorner"></div>').
          css({
            position : 'absolute',
            top      : $(this).offset().top + $(this).height() - 25,
            left     : $(this).offset().left + $(this).width() - 25,
            'z-index': 100
          }).
          mousedown(function() {
            // Resize start
            tw.suspendEditing();
            $('body').css('cursor', 'se-resize');

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
                // Resize stop
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

        $('.titleBar, .resizeCorner').remove();
      });
  };

  return tw;
}();


$(function() {
  $tw.wysiwyg = $('#wysiwyg');

  $tw.wysiwyg.bind("keyup mouseup", $tw.checkIfDirty);

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
    for (var i = 0; i < 3; i++) {
      $(this).parent().before('<input type="file" name="files[]" /><br />');
    }
    return false;
  });

  $tw.activateImageEvents();

  $tw.pollForNewContent();
});
