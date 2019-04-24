// import { EventEmitter } from "events";

// import { Message } from "protobufjs";
// import { EventEmitter } from "events";
// import StrictEventEmitter from 'strict-event-emitter-types';

declare module 'node-osc' {

    // type stringOrNumber = {

    // // }
    // interface Events {
    //         message:(msg:any[], origin:any) => void;
    // }       

    // type MyEmitter = StrictEventEmitter<EventEmitter, Events>;  
    // interface TypedEventEmitter<T> {
    //     on<K extends keyof T>(s: K, listener: (v: T[K]) => void);
    // // and so on for each method
    // }

  
    export class Client {
        constructor(host:string, port:number);
        send(msg:any[], callback?:Function)
    }

    type MessageCallback = (message:any[], origin:any) => void;
    export class Server  {
        constructor(port:number, ipaddress:string)
        on(eventName:string, callback:MessageCallback)
    }   

}


