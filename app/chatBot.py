# -*- coding: utf-8 -*-

import os
import tornado.websocket
import tornado.ioloop
import tornado.options
import tornado.web
import os.path
import re

import json

from docopt import docopt

port = int(os.environ.get("PORT"))

class myBot():
    '''myBot command usage

    usage: 
         *  (bot|@bot|bot:) ping
         *  (bot|@bot|bot:) -h | --help
    options:
         *  -h --help     Show this screen

    '''
    def commandProcess(self,commands):
        print 'mybot reply'
        try:
            args = docopt(myBot.__doc__,commands)
        except:
            return {"success":True,"type":"bot","text":myBot.__doc__,"responceType":"help"}
        
        if args['ping']:
            return {"success": True,"type": "bot","text": "pong","responceType":"ping"}
        

class MainHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.render("index.html")

class WebSocket(tornado.websocket.WebSocketHandler):
    clients = set()
    bot = myBot()
    prefixPattern = re.compile(r'^(bot:|@bot |bot )')
    splitPattern = re.compile(r'\s*|:')

    def open(self):
        WebSocket.clients.add(self)
        print("open websocket connection")

    def on_message(self,message):
        message = json.loads(message)
        msgtext = unicode(message['text'])
        msgtext = msgtext.strip()
        if WebSocket.prefixPattern.match(msgtext):
            #bot mention processing here
            commands = re.split(WebSocket.splitPattern,msgtext)
            botReply = WebSocket.bot.commandProcess(commands)
            self.write_message(botReply)
        else:
            #user text processing here
            self.broadCastMessage(message)

    def on_close(self):
        WebSocket.clients.remove(self)
        print("close websocket connection")

    def broadCastMessage(self,message):
        for client in WebSocket.clients:
            if client == self:
                continue
            client.write_message({'type':'message','text':message['text']})
    

app = tornado.web.Application(
    handlers=[
        (r"/",MainHandler),
        (r"/ws",WebSocket),
    ],
    template_path = os.path.join(os.path.abspath(os.path.dirname(__file__)),"templates"),

    static_path = os.path.join(os.path.abspath(os.path.dirname(__file__)),"static"),
    debug = True
)



if __name__ == "__main__":
    tornado.options.parse_command_line()
    app.listen(port)
    print port
    tornado.ioloop.IOLoop.instance().start()

