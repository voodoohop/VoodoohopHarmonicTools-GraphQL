import { ApolloServer, gql, PubSub, IResolvers }  from 'apollo-server';

import {parseFile as parseAudioFileMetadata, IAudioMetadata} from "music-metadata"


import DataLoader = require('dataloader');

const pubsub = new PubSub();

const HELLO_ADDED = 'HELLO_ADDED';

const LIVE_STATE_CHANGED = 'LIVE_STATE_CHANGED';

import {getKeyFormatter} from "./keyformatter";
import extractRelevantMetadata from './extractRelevantMetadata';

import {QueryResolvers, MetadataResolvers, Resolvers, AudioFile, SubscriptionResolvers, RawMetadata, Maybe, AbletonLiveState, AbletonLiveControls, KeyNotation} from "./@types/generatedTypes";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

    enum KeyNotation {
        TRADITIONAL
        CAMELOT
        OPENKEY
    }

    type RawMetadata {
        key: String!
        value: String!
    }

    type Metadata {
        title: String
        artist: String
        musicalKey(notation:KeyNotation = TRADITIONAL): String
        bpm: Float
        album: String
        comment: String
        genre: String
        energy: Float
        rawFields: [RawMetadata!]!,
        field(key: String!): String
    }

    type AudioFile {
        path: ID!
        metadata: Metadata
    }

    type AbletonLiveControls {
        keyNotation: KeyNotation
        visibility: Boolean
        updateClipNames: Boolean
        updateClipColors: Boolean
        masterTempo: Float
    }

    type AbletonLiveState {
        controls: AbletonLiveControls!
        tracks: [AbletonLiveTrack!]!
    }

    type Query {
        hello: String
        audioFile(path: String!): AudioFile
        live: AbletonLiveState
    }

    type Subscription {
        helloAdded: String,
        liveState: AbletonLiveState  
    }
`;

let abletonStateStore:AbletonLiveState = {controls:{}};

const audioMetadataLoader = new DataLoader<string, IAudioMetadata>(function(path:string[]):Promise<IAudioMetadata[]> {
    // console.log("I got", path); 
    return Promise.all(path.map(path => parseAudioFileMetadata(path, {native: true})));
}, {batch:false});
// Prove resolver functions for your schema fields

const queryResolvers:QueryResolvers = {
    hello: () => 'Hello world!',  
    audioFile: async (_:any, {path} :{path:string}):Promise<AudioFile> => {
        console.log("returning metadata for path", path);
        const metadata = extractRelevantMetadata(await audioMetadataLoader.load(path));
        console.log("returning fields",metadata);   
        const result:AudioFile = {path, metadata};   
        return result;
    },
    live: ():AbletonLiveState => abletonStateStore
  }

const metadataResolvers:MetadataResolvers = {
    field: ({rawFields},{key: searchKey}):Maybe<string> => {     
        // console.log("getting subdata",fields, key);
        const findResult = rawFields.find(({key}) => key === searchKey)
        if (findResult === undefined)
            return null;
        return ""+findResult.value
    },
    musicalKey: ({musicalKey}, {notation}) => {
        if (musicalKey === null || musicalKey === undefined)
            return null; 
        console.log("args", musicalKey, notation);
        return getKeyFormatter(notation)(musicalKey);                 
    }
  };



const subscriptionResolvers:SubscriptionResolvers = {
    helloAdded: { subscribe: () => pubsub.asyncIterator([HELLO_ADDED]) },
    liveState: { subscribe: () => pubsub.asyncIterator([LIVE_STATE_CHANGED]) }
};
const resolvers:IResolvers= {
  Query: queryResolvers,
  Metadata: metadataResolvers,
  Subscription: subscriptionResolvers
};

const server = new ApolloServer({ typeDefs, resolvers });   
server.listen({port: parseInt(process.env.PORT || "4000")}).then(({ url }:{url:string}) => {
  console.log(`🚀 Server ready at ${url}`)
});

setInterval(() =>{
    console.log("hello");
     pubsub.publish(HELLO_ADDED, {helloAdded: "hello"})
}, 50000)



const virtualenv:any = require("virtualenv");
import {resolve} from "path";

import {stderr, stdout} from "process"
var packagePath = resolve("./package.json"); 
var env = virtualenv(packagePath);  

var child = env.spawnPython([resolve("./src/python/analyzeKey.py")]);
child.stderr.pipe(stderr);
child.stdout.pipe(stdout);
// console.log(child);

import {createClient, createServer, MessageCallback} from "node-osc";

import sleep = require('await-sleep');


import {getOscInputStream,addOscOutputStream, VoodoohopMessage, VoodooMessageTypes, VoodoohopControlMessage} from "./liveModel/oscInOut";

function controlMessageToState({key,value}: VoodoohopControlMessage):Maybe<AbletonLiveControls> {
    const mapKeynotation:{[index:string] : KeyNotation} = {
        "trad": KeyNotation.Traditional,
        "camelot": KeyNotation.Camelot,
        "openkey": KeyNotation.Openkey
    }
    if (key === "keyNotation")
        return {keyNotation: mapKeynotation[value as string]};
    if (key === "updateClipNames")
        return {updateClipNames: value > 0};
    if (key === "updateClipColors")
        return {updateClipColors: value > 0};
    if (key === "visibility")
        return {visibility: value > 0};
    return null;
}

async function startOSCServer() {

    const oscInput$= await getOscInputStream();
    console.log("got input stream",oscInput$);
   
    const controlMessage$:Stream<VoodoohopControlMessage> = oscInput$.filter(({type}) => type === VoodooMessageTypes.CONTROL).map(m => m as VoodoohopControlMessage);
    const controlMessageState$:Stream<AbletonLiveControls> = 
        controlMessage$
        .map(controlMessageToState)
        .filter(s => s !== null)
        .scan((state:AbletonLiveControls, messageState:AbletonLiveControls) => ({...state, ...messageState}),{});


   
        oscInput$.observe((m:any) => console.log(m));
    
    controlMessageState$.observe((m:any) => console.log(m));
}
// console.log("inputstreams",, oscOutput);
startOSCServer();

import {just, Stream} from 'most';

addOscOutputStream(just({address: "/sendAll", data:null}))
