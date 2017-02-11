$(function(){
  console.log('extract-entities.js loaded');
  console.log('flock is', flock);
  
  $('#openT2S').click(function(){
    console.log('Click on #openT2S fired!');
    flock.openWidget('https://dwhack-kashodiya.c9users.io/flock/t2s', 'modal');
  });
  
});