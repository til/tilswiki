/*
 * Stuff related to dragging images around
 */

var dragMode = false;
var lastY;

function distanceToMouse(e) {
  return Math.abs(e.offsetTop - lastY) + e.offsetHeight / 2;
}

// Call to start drag mode
function drag() {
  console.log('drag');
  dragMode = true;
  $(this).addClass('dragged');
  wysiwyg.mousemove(dragMouseMove);
  wysiwyg.mouseup(drop);
  return false;
}

function drop() {
  console.log('drop');
  wysiwyg.
    unbind('mousemove', dragMouseMove).
    unbind('mouseup', drop);

  $('#dropTarget').replaceWith($('.dragged').removeClass('dragged').remove());
  imagesDraggable();

  dragMode = false;
  checkIfDirty();
}

// This should listen to mousemove when in dragmode
function dragMouseMove(mouseEvent) {
  lastY = mouseEvent.pageY;

  $('#dropTarget').remove();

  // Find element that is closest to mouse position
  var closest = null;
  $('h1,h2,h3,br', wysiwyg).each(function() {
    if (closest) {
      if (distanceToMouse(this) < distanceToMouse(closest)) {
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
}

function imagesDraggable() {
  $('img', wysiwyg).
    attr('contenteditable', false).
    mousedown(drag);
}

