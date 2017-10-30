'use strict';

//
// YOUR CODE GOES HERE...
//
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░
// ░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░
// ░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░
// ░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░░
// ░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░░
// ░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░░
// ░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░░
// ░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░░
// ░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░░
// ░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░░
// ░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░░░
// ░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░░
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//
// Nyan cat lies here...
//

const LifeGameVirtualDom = require('../lib/LifeGameVirtualDom');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080});
const LifeGame = new LifeGameVirtualDom();

LifeGame.sendUpdates = (data) => {
	for (let i=0; i<all_clients.length; i++) {
		all_clients[i].send(JSON.stringify({
			type: 'UPDATE_STATE',
			data: data
		}));
	}
}
let all_clients = [];

wss.on('connection', (ws, req) => {
	// console.log(req);
	let url = require('url').parse(req.url);
	// console.log(url);
	const params = url.query.split('=');
	if (params[0] != 'token') {
		console.log('No token');
	}
	if (!params[1].length) {
		console.log('Bad token name');
	}
	all_clients.push(ws);
	ws.on('message', (event) => {
	    try {
	    	// console.log(event);
			let msg = JSON.parse(event);
			// console.log(msg);
			if (msg.type === 'ADD_POINT')	 {
				// LifeGameVirtualDom.applyUpdates(data: Object): void - Применяет изменения в игре
				LifeGame.applyUpdates(msg.data);
			} 
		} catch(err) {
			// console.log(err);
		}
	});
	ws.send(JSON.stringify({
		type: 'INITIALIZE',
		data: {
			state: LifeGame.state,
			settings: LifeGame.settings,
			user: {
				token: params[1],
				color: "#"+((1<<24)*Math.random()|0).toString(16)
			}
		}
	}));
});

