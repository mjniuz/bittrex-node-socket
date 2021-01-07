"use strict";
const util  = require('util');
const WebSocket = require('ws');

const ws = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});

ws.on('open', function open() {
    ws.send('something');
});


ws.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });


    const SignalRClient = require('./lib/client.js');

    let client = new SignalRClient({
        pingTimeout:10000,
        useCloudScraper:true
    });

    client.on('ticker', function(data){
        console.log(util.format("Got ticker update for pair '%s'", data.pair));

        ws.send(JSON.stringify(data));
        //console.log(data);
    });

    console.log("=== Subscribing to 'USDT-BTC' pair");
    client.subscribeToTickers([
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
    ]);
});
