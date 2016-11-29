'use strict';

var ws_addr = 'ws://mycbot.herokuapp.com/ws'
//var ws_addr = 'ws://mycbot.herokuapp.com:'+ port + '/ws'
//var ws_addr = 'ws://localhost:'+ port + '/ws'
console.log(ws_addr)
var ws = new WebSocket(ws_addr);
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
    console.log('send message: %s', $('#m').val());
    ws.send(jsonmsg);
    console.log('message sent');
    //ws.send($('#m').val());
    $('#m').val('');
    $('#messages')
      .append($('<li>')
      .append($('<span class="message">').text(json.text)));
    window.scrollTo(0, document.body.scrollHeight);
    return false;
  });
  ws.onmessage = function(msg){
    console.log('onmessage')
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
