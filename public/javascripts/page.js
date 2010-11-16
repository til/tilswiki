// $tw is the main tilswiki javascript module, concerned with core functionality
// edit, autosave etc.

var $tw = function() {
  var tw = {};
  var editing = true;

  tw.putContent = function() {
    var successCallback = function(data, textStatus) {
      // Only run the callback when no other ajax call has been started later
      if ($('.progress').data('allowedSuccessCallback') === successCallback) {
        wysiwyg.data('version_number', data.version_number);
        tw.progressSaved();
      }
    };

    tw.progressSaving();

    $('.progress').data('allowedSuccessCallback', successCallback);

    tw.rememberSavedContent();

    $.ajax({
             url:     '/' + document.location.toString().split('/').pop(),
             data:    { "page[version_number]" : wysiwyg.data('version_number'),
                        "page[body]"           : wysiwyg.html() },
             type:    'PUT',
             'success': successCallback,
             'error'  : function(xhr) {
               $(".progress").html("<span class='error'>Save failed</span>");
               if (xhr.status == 409) {
                 alert("Save failed, someone else is editing this too. Reload the page then try again.\n\nSorry, but this is better than overwriting each other's changes.");
               }
             }
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

    if (
      !progress.data('unsaved_at')
    ||
      progress.data('saving_at') > progress.data('unsaved_at')
    ) {
      progress.html('<span>All changes saved</span>');
    }
  };

  tw.suspendEditing = function() {
    $('#wysiwyg').attr('contenteditable', false);
    editing = false;
  };
  tw.resumeEditing = function() {
    editing = true;
    $('#wysiwyg').attr('contenteditable', true);
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
    $(data).find('ul.assets li').each(function() {
      $('#wysiwyg .clear').before($(this).html()).append('<br/>');
    });

    tb_remove(); // close thickbox

    tw.activateImageEvents();

    tw.checkIfDirty();
  };

  tw.activateImageEvents = function() {
    $('#wysiwyg div.image').
      attr('contenteditable', false).
      bind('mouseenter', function() {
        if (!editing) { return; }

        var imageContainer = $(this);

        var titleBar = $('<div class="titleBar" '
                         + 'title="Click and drag mouse to move image"></div>').
          attr('contenteditable', false).
          mousedown(function() {
            // Drag start
            tw.suspendEditing();

            var dropTarget = $('<div class="dropTarget"></div>');

            $('body').
              css('cursor', 'move').
              append(dropTarget);

            var targetElements = $('h1, h2, br, div.image, p', $('#wysiwyg'));
            var targets = targetElements.map(function() {
              return $(this).position().top + 2;
            }).get().sort(function(a, b) { return a - b; });

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

        var resizeCorner = $('<div class="resizeCorner" '
                             + 'title="Click and drag mouse to resize image"></div>').
          mousedown(function() {
            // Resize start
            tw.suspendEditing();
            $('body').css('cursor', 'se-resize');
            $('.titleBar, .resizeCorner').remove();

            var image = $('img', imageContainer);
            var ratio = image.width() / image.height();

            var resizeFrame = $('<div id="resizeFrame"></div>');
            resizeFrame.css({
              top   : image.offset().top - 5,
              left  : image.offset().left - 5,
              width : image.width(),
              height: image.height()
            });
            $('body').append(resizeFrame);

            var sizes = [ { 'width' : 100, 'name' : 'thumb'  },
                          { 'width' : 350, 'name' : 'half' },
                          { 'width' : 700, 'name' : 'full'  }];
            for(var i=0; i < sizes.length; i++) {
              sizes[i].height = sizes[i].width / ratio;
            }
            for(var i=0; i < sizes.length; i++) {
              if (sizes[i+1]) {
                sizes[i].thresholdX = imageContainer.offset().left + sizes[i+1].width / 2;
                sizes[i].thresholdY = imageContainer.offset().top + sizes[i+1].height / 2;
              }
            }

            $(document).
              mousemove(function(mouseEvent) {
                var idx = 0;
                for (var i=0; i < sizes.length; i++) {
                  if (i == sizes.length-1) { break; }
                  if (mouseEvent.pageX < sizes[i].thresholdX && mouseEvent.pageY < sizes[i].thresholdY) {
                    break;
                  }
                  idx++;
                }
                if (sizes[idx].width != resizeFrame.width()) {
                  resizeFrame.css({
                    width : sizes[idx].width,
                    height: sizes[idx].height
                  });
                }
                return false;
              }).
              one('mouseup', function() {
                // Resize stop
                $(document).unbind('mousemove');

                $.each(sizes, function() {
                  if (this.width == resizeFrame.width()) {
                    image.attr('src', image.attr('src').replace(/\.(thumb|half|full)\./, '.' + this.name + '.'));
                  }
                });

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
      }).
      bind('mousedown', function() {
        // Avoid unwanted drag within contentEditable element
        return(false);
      });
  };

  tw.activateLinkEvents = function() {
    $("#wysiwyg a").
      click(function() {
        window.location = $(this).attr('href');
        return false;
      }).hover(
        function() { tw.suspendEditing(); },  // The only way to get a cursor hand
        function() { tw.resumeEditing(); } ); // on link hovering, it seems
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
      $('#panel_' + cmd).click(function() {
        document.execCommand(cmd, false, []);
        return false;
      });
    }
  );

  $('#panel_colorRed').click(function() {
    document.execCommand('forecolor', false, '#ff1111');
    return false;
  });
  $('#panel_colorGreen').click(function() {
    document.execCommand('forecolor', false, '#00aa00');
    return false;
  });
  $('#panel_colorBlue').click(function() {
    document.execCommand('forecolor', false, '#1111ff');
    return false;
  });

  // Bind heading commands. To support non-firefox, this should
  // call "formatBlock Heading 1" instead
  $.each(
    ['h1', 'h2'],
    function() {
      var cmd = this.toString();
      $('#panel_' + cmd).click(function() {
        document.execCommand('heading', false, cmd);
        return false;
      });
    }
  );

  $('#panel a').mousedown($tw.checkIfDirty);

  $('#imageUpload form').ajaxForm({ dataType: 'xml', success: $tw.imageUploadSuccess });

  $tw.rememberSavedContent();
  $tw.putContentIfIdle();

  $('a.cancel').click(function() {
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
  $tw.activateLinkEvents();

  var versions = {};
  var current_version = $('#current_version');
  function updateCurrentVersion(number) {
    current_version.html('<p>Version ' + number + '</p>' +
                         '<p>' + prettyDate(versions[number-1]['created_at']) + '</p>' +
                         '<p class="detail">(' + versions[number-1]['created_at'] + ')</p>');
    if(number < versions.length) {
      current_version.append("<button class='ui-state-default ui-corner-all'"
                             + " title='Revert page content to this version'>Revert to<br />this version</button>");
      $('button', current_version)
        .hover(
          function() {
            $(this).addClass("ui-state-hover");
          },
          function() {
            $(this).removeClass("ui-state-hover");
          }
        )
        .click(function() {
          switchToEditPanel(true);
        });
    }
  }

  function switchToEditPanel(revert) {
    $('#slider').slider('destroy');
    current_version.html('');
    if (!revert) {
      $('#wysiwyg').html($('#wysiwyg').data('content'));
    }
    $('.progress').html('');
    $tw.resumeEditing();

    $('#panel div').removeClass('current');
    $('#panel .nav a[href=#panel_edit]').parent('div').addClass('current');

    $("#panel_edit").show();
    $("#panel_history").hide();
  }

  $('a[href=#panel_history]').click(function() {
    $tw.suspendEditing();

    $('#slider').hide();

    $.ajax({
      url      : document.location + '/versions',
      dataType : 'json',
      success  : function(data) {
        versions = data;
        $('img.progress').remove();
        $('#slider').
          show().
          css('height', Math.max(Math.min(versions.length * 10, 500), 50) + 'px').
          slider({
          orientation : 'vertical',
          min : 1,
          max : versions.length,
          value : versions.length,
          slide : function(event, ui) {
            updateCurrentVersion(ui.value);
          },
          change : function(event, ui) {
            $('#wysiwyg').load(window.location + '?version=' + ui.value);
          }
        });
        updateCurrentVersion(versions.length);
      }
    });

    $("#panel_history").show().
      find("h2").after('<img class="progress" src="/images/ajax-loader.gif" />');
    $("#panel_edit").hide();
    return false;
  });

  $('a[href=#panel_edit]').click(function() {
    switchToEditPanel();
    return false;
  });

  $(window).resize(
    function() {
      if ($("body").width() > ($("#wysiwyg").outerWidth() + $("#panel").outerWidth())) {
        // Body is wide enough for both wysiwyg and panel
        $("#panel").css({ 
                          position : "fixed",
                          top : "0.25em",
                          left : ($("#wysiwyg").outerWidth() + 10) + "px"
                        });
      } else {
        // Body is too narrow
        $("#panel").css({ position : "relative", top : 0, left : 0 });
      }
    }
  ).resize();
});
