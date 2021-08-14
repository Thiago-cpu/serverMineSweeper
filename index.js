const express = require('express');
const WebSocket = require('ws')

const PORT = 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocket.Server({ server });

let mines;
let clicksCords = []


wss.on("connection", ws => {
    if(mines && clicksCords[0]){
      console.log("hola")
       ws.send(JSON.stringify(mines))
       clicksCords.forEach(click => {
         ws.send(JSON.stringify(click))
       })
    }
    console.log("new client connected")
    ws.on("message", (data) => {
        const json = JSON.parse(data)
        if(json.type === 'mines' && !mines){
          mines = json
        }
        if(json.type === 'click'){
          clicksCords.push(json)
        }
        if(json.type === 'restart'){
          mines = null
          clicksCords = []
        }
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(json));
            }
        })
    })
})