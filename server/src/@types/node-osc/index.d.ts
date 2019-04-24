import { Message } from "protobufjs";
import { EventEmitter } from "events";
import StrictEventEmitter from 'strict-event-emitter-types';

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
  
    export class Client extends EventEmitter {
        constructor(host:string, port:number);
    }
    export class Server extends EventEmitter {
        constructor(port:number, ipaddress:string);
    }

}