$(document).ready(function(){
$('.column').hover(function(){
  $(this).toggleClass('hover');
});
$('.column').mouseleave(function(){
  $(this).css('border-color', 'white');
});
$('.column').click(function(){
  $(this).toggleClass('clicked');
});
})
