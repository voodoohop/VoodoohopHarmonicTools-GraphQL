



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
    import { EventEmitter } from 'events'
  
 

// type OSCMessage = [string,      ...number];

    type OSCClient = (...message: any[]) => void;

    type MessageCallback = (message:any[], origin:any) => void;
   
    

    export function createServer(port:number, host:string):Promise<EventEmitter>;

    export function createClient(host:string,   port:number): OSCClient;

}


