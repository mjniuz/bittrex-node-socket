"use strict";
const util  = require('util');
const http = require('http');
const WebSocket = require('ws');
const express = require('express');


const app = express();
const server = http.createServer(app);

const ws = new WebSocket.Server({ server });

app.get('/', function(req, res, next) {
    return res.send('Hello World!');
});

ws.on('open', function open() {
    console.log("open new");
});

ws.on("error", function(err){
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
});

ws.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });


    ws.on("error", function(err){
        console.log("Caught flash policy server socket error: ");
        console.log(err.stack);
    });

    const SignalRClient = require('./lib/client.js');

    let client = new SignalRClient({
        pingTimeout:10000,
        useCloudScraper:true
    });

    client.on('ticker', function(data){
        console.log(util.format("Got ticker update for pair '%s'", data.pair));

        ws.send(JSON.stringify(data), (err) => {
            if (err) console.error(err);
        });
        //console.log(data);
    });

    console.log("new subscribe");
    var pairs   = [
        'USDT-BTC',
        'USDT-XLM',
        'USDT-XRP',
        'USDT-XMR',
        'USDT-ADA',
        'USDT-DOGE',
        'USDT-LINK',
        'USDT-MATIC',
        'USDT-UNI',
        'USDT-TRX',
        'USDT-BTT',
        'USDT-CKB'
    ];
    client.unsubscribeFromTickers(pairs);
    setTimeout(function(){
        client.subscribeToTickers(pairs);
    },1000);
});



server.listen(8080, function(err) {
    if (err) {
        throw err;
    }
    console.log(`listening on port 8080!`);
});
