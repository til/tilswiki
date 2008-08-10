// progress gif from http://www.andrewdavidson.com/articles/spinning-wait-icons/
// by-nc-sa licensed

function putContent() {
  progressSaving();
  $.ajax({
           url:     '/' + document.location.toString().split('/').pop(),
           data:    { content: $('#wysiwyg').html() },
           type:    'PUT',
           'success': function(data, textStatus) {
             progressSaved();
           }
         });
}

function putContentIfIdle() {

  var last_changed_time = $('#wysiwyg').data('last_changed_time');

  if (last_changed_time && (new Date()).getTime() > last_changed_time + 1 * 1000) {
    $('#wysiwyg').removeData('last_changed_time');
    putContent();
  }

  setTimeout(putContentIfIdle, 1000);
}

function progressUnsaved() {
  $('#wysiwyg').data('last_changed_time', (new Date()).getTime());
  $('.progress').html('unsaved changes');
}

function progressSaving() {
  // TODO show at least for 1 sec
  $('.progress').html('<img src="/wait16.gif" />saving...');
}

function progressSaved() {
  var span = $('.progress').html('<span>saved</span>').children();
  setTimeout(function() {
    span.fadeOut('slow');
  }, 2000);
}


$(function() {

  $('#wysiwyg').keyup(progressUnsaved);

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

  putContentIfIdle();
});
