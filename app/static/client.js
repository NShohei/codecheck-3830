'use strict';

var ws_addr = 'wss://mycbot.herokuapp.com/ws'

console.log(ws_addr)
var ws = new WebSocket(ws_addr);
$(function () {
  $('form').submit(function(){
    var $this = $(this);
    var json = {};
    json.text = $('#m').val();
    var jsonmsg = JSON.stringify(json);
    console.log('send message: %s', $('#m').val());
    ws.send(jsonmsg);
    console.log('message sent');
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
    console.log(resp)
    if(resp.type == 'bot' && resp.responceType == 'help'){
	arr = resp.text.split(/\r\n|\r|\n/);
	for (i = 0; i < arr.length; i++) {
	    $('#messages')
		.append($('<li>')
			.append($('<span class="message">').text(arr[i])));
	}
    }else{
	$('#messages')
	    .append($('<li>')
		    .append($('<span class="message">').text(resp.text)));
	console.dir(resp)
    }
  };
  ws.onerror = function(err){
    console.log("err", err);
  };
  ws.onclose = function close() {
    console.log('disconnected');
  };
});
