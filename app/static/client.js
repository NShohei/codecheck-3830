'use strict';


var ws = new WebSocket('ws://mycbot.herokuapp.com:3000/ws');
$(function () {
  $('form').submit(function(){
    var $this = $(this);
    // ws.onopen = function() {
    //   console.log('sent message: %s', $('#m').val());
    // };
    // translate text to JSON(add)
    var json = {};
    json.text = $('#m').val();
    var jsonmsg = JSON.stringify(json);
    ws.send(jsonmsg);
    //ws.send($('#m').val());
    $('#m').val('');
    $('#messages')
      .append($('<li>')
      .append($('<span class="message">').text(json.text)));
    window.scrollTo(0, document.body.scrollHeight);
    return false;
  });
  ws.onmessage = function(msg){
    var resp = JSON.parse(msg.data);
    $('#messages')
      .append($('<li>')
      .append($('<span class="message">').text(resp.text)));
    console.dir(resp)
  };
  ws.onerror = function(err){
    console.log("err", err);
  };
  ws.onclose = function close() {
    console.log('disconnected');
  };
});
