// progress gif from http://www.andrewdavidson.com/articles/spinning-wait-icons/
// by-nc-sa licensed

// A global. Brrrr!
var wysiwyg;

function putContent() {
  progressSaving();

  rememberSavedContent();

  $.ajax({
           url:     '/' + document.location.toString().split('/').pop(),
           data:    { content: $('#wysiwyg').html() },
           type:    'PUT',
           'success': function(data, textStatus) {
             progressSaved();
           }
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
 *
 * Functions that update the progress indicator area. Consider the
 * following sequence of events:
 *
 * progressUnsaved
 * progressSaving 1
 * progressUnsaved
 * progressSaving 2
 * progressSaved 1
 * progressSaved 2
 *
 * The event progressSaved 1 has been obsoleted and shouldn't have an
 * effect anymore, but TODO currently it does
 *
 */

function progressUnsaved() {
  $('.progress').
    data('unsaved_at', (new Date()).getTime()).
    html('<span class="unsaved">unsaved changes</span>');
}

function progressSaving() {
  $('.progress').
    data('saving_at', (new Date()).getTime()).
    html('<img src="/ajax-loader.gif" /><span>saving...</span>');
}

function progressSaved() {
  var progress = $('.progress');
  var childrenToFadeOut;

  if (
    !progress.data('unsaved_at')
  ||
    progress.data('saving_at') > progress.data('unsaved_at')
  ) {
    progress.html('<img src="/ajax-loader-still.gif" /><span>saved</span>');

    childrenToFadeOut = progress.children();

    setTimeout(function() {
      childrenToFadeOut.fadeOut('slow');
    }, 1000);
  }
}

// Call this on all events that may have changed the content
 function checkIfDirty() {
  if (wysiwyg.data('content') !== wysiwyg.html()) {
    wysiwyg.data('last_changed_time', (new Date()).getTime());
    progressUnsaved();
  }
}


$(function() {
  wysiwyg = $('#wysiwyg');

  wysiwyg.bind("keyup mouseup", checkIfDirty);

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

  rememberSavedContent();
  putContentIfIdle();
});
