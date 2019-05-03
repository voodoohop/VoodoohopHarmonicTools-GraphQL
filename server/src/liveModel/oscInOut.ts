import {fromEvent,fromPromise, Stream} from 'most';

import {createServer,createClient, MessageCallback} from "node-osc";
import { EventEmitter } from 'events';
import { Maybe } from '../@types/generatedTypes';
// import {create as createSubject} from "most-subject";

const log=(name:string) => (...a:any[]) => console.log(name,";",...a);
type OSCArgument = string | number;

type OSCMessage = {
  address: string,
  data: OSCArgument[]
}


function startServer():Stream<OSCMessage> {

  const server$ = fromPromise(createServer(8889, '0.0.0.0'));;
   // oscServer.setMaxListeners(100);
   //  onsole.log("oscSerrver in renderer", oscServer);
   
   let oscInputStream:Stream<OSCMessage> = server$.flatMap(oscServer => fromEvent<any[]>("message", oscServer))
   .tap(oscIn => console.log("oscIn",oscIn))
   .map((f:any[][]) => f[0])
   .map(([address, ... data]) => ({address:""+address, data})); 
   // .skipRepeatsWith((e,f) => JSON.stringify(f) === JSON.stringify(e))
   // .tap(log("oscIn"));
   return oscInputStream;
  }

let oscInputStream:Maybe<Stream<OSCMessage>> = null;

export function getOscInputStream():Stream<OSCMessage> {
   if (!oscInputStream)
     oscInputStream = startServer().multicast();
   
   return oscInputStream;
}


const clientSend=createClient("localhost", 7778);

export function addOscOutputStream(outStream:Stream<OSCMessage> ):void {
  outStream.observe(message => 
  clientSend(message.address, ...message.data, function () {
// 			resolve(Immutable.Map({ sent: oscMessage }));
// 			// client.kill();
		}));
    // message.address)
}


// export var oscInputStream = fromEvent<any[]>("message", oscServer)
// 	// .map((f:any[]) => f[0])
// 	// .skipRepeatsWith((e,f) => JSON.stringify(f) === JSON.stringify(e))
// 	.tap(log("oscIn"));


// // 	// .multicast();
// // // export oscInputStream as oscInp;
// oscInputStream.observe(log("inputStream"))
// export var oscInputStream=null;
// exportvar oscOutput = null; //createSubject();


// // oscOutput
// // .observe(oscStatus => console.log("osc out:", oscStatus.toJS()));

// var currentOscSender = new Promise(resolve => resolve({}));

// var client = new Client('127.0.0.1', 7778);

// oscOutput
// 	.tap(log("oscOutputBefore", (msg) => [msg.get("trackId")].concat(msg.get("args").toArray())))

// 	.bufferedThrottle(5)
// 	// .tap((l)=>con)
// 	// .merge(actionStream.filter(a => a.get("type")==="oscOutput"))
// 	.scan((oscSender, oscMessage) => oscSender.then(() => new Promise(resolve => {
// 		// console.log("sending, ", oscMessage.toJS());
// 		client.send("" + oscMessage.get("trackId"), ...oscMessage.get("args").toArray(), function () {
// 			resolve(Immutable.Map({ sent: oscMessage }));
// 			// client.kill();
// 		});
// 	}
// 	)), currentOscSender)
// 	.flatMap(f => most.fromPromise(f))
// 	.observe(log("oscSent")).catch(console.error.bind(console));


// oscOutput.plug(actionStream.filter(a => a.get("type") === "oscOutput"));

// // export { oscOutput, oscInputStream };
