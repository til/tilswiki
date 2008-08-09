function titleBar() {
  return ' \
    <img src="/titlebar.png" title="You can drag this to another position"/> \
    <form class="delete">                                                    \
      <button class="unbound" type="submit" title="Delete this">X</button>                   \
    </form>                                                                  \
  '
}

function spacer() {
  return '<div class="spacer unbound"><p>click to insert</p></div>';
}

function makeDivNotEditable(e) {
  $(this).removeClass('edit');

  var ta = $('textarea', this);
  ta.replaceWith('<p>' + ta.val() + '</p>');
}

function makeDivEditable(e) {
  // Maybe call makeDivNotEditable on $('.edit') here
  $(this).addClass('edit');

  var p = $('p', this);
  p.replaceWith('<textarea>' + p.text() + '</textarea>');
  $('textarea', this).focus();

  $(this).bind('mouseleave', makeDivNotEditable);

  //$(this).replaceWith(createTextArea($(this).text()));
  //$('div').draggable({ handle: $('img', this), helper: 'clone', opacity: 0.1});
}

function bindDefaultEvents() {
  $('div.element.unbound').bind("mouseenter", makeDivEditable);

  $('div.spacer.unbound').
      bind("mouseenter", function() {
        $(this).addClass('active');
      }).
      bind("mouseleave", function() {
        $(this).removeClass('active');
      }).
      bind("click", function() {
        // Add an element
        $(this).removeClass('active');
        $(this).before(spacer());
        $(this).before('<div class="element edit unbound">' + titleBar() + '<textarea>new text here</textarea><div>');
        bindDefaultEvents();
      });

  $('form.delete button.unbound').click(function() {
    $(this).prev('div.spacer').remove(); // doesn't work yet
    $(this).parents('div.element').remove();
    return false;
  });

  $('.unbound').removeClass('unbound');
}

$(function() {
  //$('div').each(function() {
  //  $(this).appendAfter()
  //});
  $('#wysiwyg').wysiwyg({ css: '/master.css' });

});
