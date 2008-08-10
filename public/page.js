// progress gif from http://www.andrewdavidson.com/articles/spinning-wait-icons/
// by-nc-sa licensed

function putContent() {
  progressSaving();
  $.ajax({
           url:     '/' + document.location.toString().split('/').pop(),
           data:    { content: $('textarea').val() },
           type:    'PUT',
           'success': function(data, textStatus) {
             progressSaved();
           }
         });
}

function putContentIfIdle() {

  var wysiwyg = $('#wysiwyg').data('wysiwyg');

  if (wysiwyg.last_changed_time &&
      (new Date()).getTime() > wysiwyg.last_changed_time + 1 * 1000) {
    delete(wysiwyg.last_changed_time);
    putContent();
  }

  setTimeout(putContentIfIdle, 1000);
}

function progressUnsaved() {
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

  $('#wysiwyg').wysiwyg({ css: '/master.css' });

  var wysiwyg = $('#wysiwyg').data('wysiwyg');

  wysiwyg.saveContentWithoutPut = wysiwyg.saveContent;

  wysiwyg.saveContent = function() {
    this.last_changed_time = (new Date()).getTime();
    progressUnsaved();

    this.saveContentWithoutPut();
  }

  putContentIfIdle();

});
