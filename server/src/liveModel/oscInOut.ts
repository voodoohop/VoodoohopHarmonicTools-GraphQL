import {fromEvent,fromPromise, Stream} from 'most';
import {UDPPort, OscMessage, Argument} from "osc";

import { Maybe } from '../@types/generatedTypes';





const log=(name:string) => (...a:any[]) => console.log(name,";",...a);

type VoodooOSCArgument = string | number |  Uint8Array;

type VoodooOSCMessage = {
  address: string,
  data: VoodooOSCArgument[] | VoodooOSCArgument | null
}

async function createServer(port:number, host:string) {
  var udpPort = new UDPPort({
    localAddress: host,
    localPort: port,
    metadata: false,
    unpackSingleArgs: true
});
udpPort.setMaxListeners(100);
  udpPort.open();
  return udpPort;
}



function convertStringsToUTF8(data:any):any {
  // console.log("converting ",data);    
  return typeof data == "string" ? decodeURIComponent(escape(data)):data
}
// here we can safely map to array because we set the configuration accordingly
const mapOSCToVoodoo = ([{args, address}]: [OscMessage]):VoodooOSCMessage => ({address, data: convertStringsToUTF8(args) as VoodooOSCArgument})

function startServer():Stream<VoodooOSCMessage> {

  const server$ = fromPromise(createServer(8889, '0.0.0.0'));;
   // oscServer.setMaxListeners(100);
   //  onsole.log("oscSerrver in renderer", oscServer);

   let oscInputStream:Stream<VoodooOSCMessage> = server$.flatMap(oscServer => fromEvent<[OscMessage]>("message", oscServer))
   .map(mapOSCToVoodoo); 
   return oscInputStream;
  }

let oscInputStream:Maybe<Stream<VoodoohopMessage>> = null;

export function getOscInputStream():Stream<VoodoohopMessage> {
   if (!oscInputStream)
     oscInputStream = startServer().map(convertOscMessage).multicast();
   
   return oscInputStream;
}

type SendFunction = (message:VoodooOSCMessage) => void;



function createClient(host:string,port:number):SendFunction {
var udpPort = new UDPPort({
  remoteAddress: host,
  remotePort: port,
  metadata: false,
  unpackSingleArgs: true
});
udpPort.open();
  return (message:VoodooOSCMessage):void=> udpPort.send({args: makeArray(message.data), address:message.address});


  function makeArray(data: VoodooOSCArgument | (VoodooOSCArgument)[] | null): VoodooOSCArgument[] {
    return data != null ? (data instanceof Array ? data : [data]) : [];
  }
}

const clientSend = createClient("localhost", 7778);

let oscClient: Maybe<Promise<Function>> = null;
export function addOscOutputStream(outStream:Stream<VoodooOSCMessage> ):void {
  outStream.observe(clientSend);
}

enum VoodoohopOscMessageTypes {
  CONTROL = "control",
  TRACK ="track",
  // SELECTEDCLIP = "selectedClip",
  UNKNOWN="unknown"
}

interface MaybeVoodoohopOscMessage {
  path: VoodoohopOscMessageTypes;
  // [propName: string]: any
}

interface VoodoohopMessageBase extends MaybeVoodoohopOscMessage{
  key: string;
  value: VoodooOSCArgument;
}

interface VoodoohopControlMessage extends VoodoohopMessageBase {
  path: VoodoohopOscMessageTypes.CONTROL;
}      

type VoodoohopClipIdentifier = "playingClip" | "selectedClip" | "UNKNOWN";
interface VoodoohopTrackClipMessage extends VoodoohopMessageBase {
  path: VoodoohopOscMessageTypes.TRACK;
  track: string;
  clip: VoodoohopClipIdentifier;
}  

interface VoodoohopUnknownMessage extends MaybeVoodoohopOscMessage {
  path: VoodoohopOscMessageTypes.UNKNOWN;
}  


// interface VoodoohopSelectedClipMessage extends VoodoohopMessageBase {
//   path: VoodoohopOscMessageTypes.SELECTEDCLIP
// }

type VoodoohopMessage = VoodoohopControlMessage | VoodoohopTrackClipMessage /*| VoodoohopSelectedClipMessage */| VoodoohopUnknownMessage;

function convertOscMessage({address, data}:VoodooOSCMessage):VoodoohopMessage {
  const [_,rootPath,...args] = address.split("/");
  // console.log("rootPath",rootPath);
   switch(rootPath) {
    case VoodoohopOscMessageTypes.CONTROL: return {
      path: VoodoohopOscMessageTypes.CONTROL, 
      key: args[0], 
      value: data as VoodooOSCArgument
    };
    case VoodoohopOscMessageTypes.TRACK: return {
      path: VoodoohopOscMessageTypes.TRACK, 
      key: args[2], 
      value: data as VoodooOSCArgument,
      track:args[0],
      clip: args[1] === "playingClip" ? "playingClip": (args[1] === "selectedClip" ? "selectedClip":"UNKNOWN")
    };
    // case VoodoohopOscMessageTypes.SELECTEDCLIP: return {
    //   path: VoodoohopOscMessageTypes.SELECTEDCLIP, 
    //   key: args[2], 
    //   value:data as VoodooOSCArgument, 
    // };
  }
   return {path: VoodoohopOscMessageTypes.UNKNOWN};
}

// function convertOscMessages(message: VoodooOSCMessage):VoodoohopMessage {
//   const [message.address.split("/")
// }


// getOscInputStream().map(convertOscMessage).observe(log("converted message"));




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
