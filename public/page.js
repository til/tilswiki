function putContent() {
  $.ajax({
           url:     '/' + document.location.toString().split('/').pop(),
           data:    { content: $('textarea').val() },
           type:    'PUT',
           'success': function(data, textStatus) {
             console.log('saveContent success');
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


$(function() {

  $('#wysiwyg').wysiwyg({ css: '/master.css' });

  var wysiwyg = $('#wysiwyg').data('wysiwyg');

  wysiwyg.saveContentWithoutPut = wysiwyg.saveContent;

  wysiwyg.saveContent = function() {
    this.last_changed_time = (new Date()).getTime();

    this.saveContentWithoutPut();
  }

  putContentIfIdle();

});
