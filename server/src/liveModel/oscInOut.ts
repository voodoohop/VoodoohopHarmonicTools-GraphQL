import {fromEvent,fromPromise, Stream} from 'most';
import {UDPPort, OscMessage, Argument} from "osc";

// import {createServer,createClient, MessageCallback} from "node-osc";
// import { EventEmitter } from 'events';
import { Maybe } from '../@types/generatedTypes';
// import {create as createSubject} from "most-subject";




const log=(name:string) => (...a:any[]) => console.log(name,";",...a);
type VoodooOSCArgument = string | number |  Uint8Array;

type VoodooOSCMessage = {
  address: string,
  data: VoodooOSCArgument[]
}

async function createServer(port:number, host:string) {
  var udpPort = new UDPPort({
    localAddress: host,
    localPort: port,
    metadata: false,
    unpackSingleArgs: false
});
udpPort.setMaxListeners(100);
  udpPort.open();
  return udpPort;
}

// here we can safely map to array because we set the configuration accordingly
const mapOSCToVoodoo = ([{args, address}]: [OscMessage]):VoodooOSCMessage => ({address, data: args as VoodooOSCArgument[]})

function startServer():Stream<VoodooOSCMessage> {

  const server$ = fromPromise(createServer(8889, '0.0.0.0'));;
   // oscServer.setMaxListeners(100);
   //  onsole.log("oscSerrver in renderer", oscServer);

   let oscInputStream:Stream<VoodooOSCMessage> = server$.flatMap(oscServer => fromEvent<[OscMessage]>("message", oscServer))
   .map(mapOSCToVoodoo); 
   return oscInputStream;
  }

let oscInputStream:Maybe<Stream<VoodooOSCMessage>> = null;

export function getOscInputStream():Stream<VoodooOSCMessage> {
   if (!oscInputStream)
     oscInputStream = startServer().multicast();
   
   return oscInputStream;
}

type SendFunction = (message:VoodooOSCMessage) => void;

function createClient(host:string,port:number):SendFunction {
var udpPort = new UDPPort({
  remoteAddress: host,
  remotePort: port,
  metadata: false,
  unpackSingleArgs: false
});
udpPort.open();
  return (message:VoodooOSCMessage)=> udpPort.send({args: message.data, address:message.address});
}

const clientSend = createClient("localhost", 7778);

let oscClient: Maybe<Promise<Function>> = null;
export function addOscOutputStream(outStream:Stream<VoodooOSCMessage> ):void {
  outStream.observe(clientSend);
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
