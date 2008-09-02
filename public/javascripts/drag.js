// A module encapsulating stuff to drag images around

$tw.drag = function(tw) {
  var drag = {};

  drag.distanceToMouse = function(e, pageY) {
    return Math.abs(e.offsetTop - pageY) + e.offsetHeight / 2;
  };

  // Call this to start drag mode
  drag.start = function() {
    console.log('drag start');
    tw.suspendEditing();
    $(this).addClass('dragged');
    $('#wysiwyg').mousemove(drag.mouseMove);
    $('#wysiwyg').mouseup(drag.drop);
    return false;
  };

  drag.drop = function() {
    console.log('drop');
    $('#wysiwyg').
      unbind('mousemove', drag.mouseMove).
      unbind('mouseup', drag.drop);

    $('#dropTarget').replaceWith($('.dragged').removeClass('dragged').remove());
    drag.imagesDraggable();

    tw.resumeEditing();
  };

  // This should listen to mousemove when in dragging mode
  drag.mouseMove = function(mouseEvent) {
    var pageY = mouseEvent.pageY;

    $('#dropTarget').remove();

    // Find element that is closest to mouse position
    var closest = null;
    $('h1,h2,h3,br', $('#wysiwyg')).each(function() {
      if (closest) {
        if (drag.distanceToMouse(this, pageY) < drag.distanceToMouse(closest, pageY)) {
          closest = this;
        }
      } else {
        closest = this;
      }
    });
    if (closest) {
      var dropTarget = $('<div id="dropTarget">&nbsp;</div>');
      prev = $(closest).prev();
      if (prev.length) {
        prev.after(dropTarget);
      } else {
        $(closest).before(dropTarget);
      }
    }
  };

  drag.imagesDraggable = function() {
    $('#wysiwyg img').
      attr('contenteditable', false).
      mousedown(drag.start);
  };

  return drag;
}($tw);



$(function() {

  $tw.drag.imagesDraggable();

  // This can be used to make the offset of br elements visible, for debugging the drop target
  // algorithm
  //$('h1,h2,h3,br', wysiwyg).each(function() {
  //  e = $(this);
  //  line = $('<div class="debugLine"></div>').css('top', e.offset().top + 'px');
  //  $('body').prepend(line);
  //});

});
