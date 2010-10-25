$(function() {
  $('.ui-state-default').hover(
    function() {
      $(this).addClass("ui-state-hover");
    },
    function() {
      $(this).removeClass("ui-state-hover");
    }
  );
});
