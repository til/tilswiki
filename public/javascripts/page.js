// progress gif from http://www.andrewdavidson.com/articles/spinning-wait-icons/
// by-nc-sa licensed

// A global. Brrrr!
var wysiwyg;

function putContent() {
  var successCallback = function(data, textStatus) {
    // Only run the callback when no other ajax call has been started later
    if ($('.progress').data('allowedSuccessCallback') === successCallback) {
      progressSaved();
    }
  }

  progressSaving();

  $('.progress').data('allowedSuccessCallback', successCallback);

  rememberSavedContent();

  $.ajax({
           url:     '/' + document.location.toString().split('/').pop(),
           data:    { content: wysiwyg.html() },
           type:    'PUT',
           'success': successCallback
         });
}

function rememberSavedContent() {
  var wysiwyg = $('#wysiwyg');
  wysiwyg.data('content', wysiwyg.html());
}

function putContentIfIdle() {
  var last_changed_time = $('#wysiwyg').data('last_changed_time');

  if (last_changed_time && (new Date()).getTime() > last_changed_time + 1 * 1000) {
    $('#wysiwyg').removeData('last_changed_time');
    putContent();
  }

  setTimeout(putContentIfIdle, 1000);
}

/*
 * Functions that update the progress indicator area
 */
function progressUnsaved() {
  $('.progress').
    data('unsaved_at', (new Date()).getTime()).
    html('<span class="unsaved">changed</span>');
}
function progressSaving() {
  $('.progress').
    data('saving_at', (new Date()).getTime()).
    html('<img src="/images/ajax-loader.gif" /><span>saving...</span>');
}
function progressSaved() {
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
}

// Call this whenever content may have changed
function checkIfDirty() {
  if (dragMode) {
    return;
  }
  if (wysiwyg.data('content') !== wysiwyg.html()) {
    wysiwyg.data('last_changed_time', (new Date()).getTime());
    progressUnsaved();
  }
}

function imageUploadSuccess(data) {
  $(data).find('ul.uploaded img').each(function() {
    document.execCommand('insertImage', false, this.src);
  });

  tb_remove();
  imagesDraggable();
  checkIfDirty();
}


$(function() {
  wysiwyg = $('#wysiwyg');

  wysiwyg.bind("keyup mouseup", checkIfDirty);

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

  $('.panel a').mousedown(checkIfDirty);

  $('#imageUpload form').ajaxForm({ dataType: 'xml', success: imageUploadSuccess });

  rememberSavedContent();
  putContentIfIdle();

  imagesDraggable();

  // This can be used to make the offset of br elements visible, for debugging the drop target
  // algorithm
  //$('h1,h2,h3,br', wysiwyg).each(function() {
  //  e = $(this);
  //  line = $('<div class="debugLine"></div>').css('top', e.offset().top + 'px');
  //  $('body').prepend(line);
  //});

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
});
