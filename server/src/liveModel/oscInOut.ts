import {fromEvent,fromPromise, Stream} from 'most';

import {createServer,createClient, MessageCallback} from "node-osc";
import { EventEmitter } from 'events';
// import {create as createSubject} from "most-subject";

const log=(name:string) => (...a:any[]) => console.log(name,";",...a);


export function getOscInputStream():Stream<any[]> {
   async function startServer():Promise<Stream<any>> {

   const oscServer = await createServer(8889, '0.0.0.0');
    // oscServer.setMaxListeners(100);
    //  onsole.log("oscSerrver in renderer", oscServer);
	let oscInputStream:Stream<any>  = fromEvent<any[]>("message", oscServer)
	.map((f:any[][]) => f[0]);
	// .skipRepeatsWith((e,f) => JSON.stringify(f) === JSON.stringify(e))
	// .tap(log("oscIn"));
	return oscInputStream;
   }

   return fromPromise(startServer()).flatMap(s => s);


//   const messageCallback:MessageCallback = (...m) => console.log("messaaage",m);
  //oscServer.ons("message", messageCallback);

}

type OSCArgument = string | number;

type OSCMessage = {
  path: string,
  message: OSCArgument[]
}

export function addOscOutputStream(outStream:Stream<any[]> ):void {
  outStream.observe()
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
