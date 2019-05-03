import { ApolloServer, gql, PubSub }  from 'apollo-server';

import {parseFile as parseAudioFileMetadata, IAudioMetadata} from "music-metadata"


import DataLoader = require('dataloader');

const pubsub = new PubSub();

const HELLO_ADDED = 'HELLO_ADDED';

import {getKeyFormatter} from "./keyformatter";
import extractRelevantMetadata from './extractRelevantMetadata';

import {QueryResolvers, MetadataResolvers, Resolvers, AudioFile, SubscriptionResolvers, RawMetadata, Maybe} from "./@types/generatedTypes";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

    enum ChordNotation {
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
        musicalKey(notation:ChordNotation = TRADITIONAL): String
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

    type Query {
        hello: String
        audioFile(path: String!): AudioFile
    }

    type Subscription {
        helloAdded: String  
    }
`;



const audioMetadataLoader = new DataLoader<string, IAudioMetadata>(function(path:string[]):Promise<IAudioMetadata[]> {
    console.log("I got", path); 
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
    helloAdded: { subscribe: () => pubsub.asyncIterator([HELLO_ADDED]) }
};
const resolvers:Resolvers= {
  Query: queryResolvers,
  Metadata: metadataResolvers,
  Subscription: subscriptionResolvers
};

const server = new ApolloServer({ typeDefs, resolvers });   
server.listen({port: parseInt(process.env.PORT || "4000")}).then(({ url }) => {
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

import {createClient    , createServer, MessageCallback} from "node-osc";

import sleep = require('await-sleep')   ;


const msgCallback:MessageCallback = (message:any[], origin:any) => {
    console.log("message",message,"origin",origin);
};
// async function startOscTest() {
// //     var oscServer2 = new Server(8900, "0.0.0.0");
// //      oscServer2.setMaxListeners(100);
// // // console.log("oscSerrver in renderer", oscServer2);

// //     oscServer2.on("message", msgCallback);

//     const oscServer = await createServer(2000,"0.0.0.0");
//     oscServer.on("message", msgCallback );
//     // const oscServer2 = await createServer(2000,"0.0.0.0");
//     // oscServer.on("error",msgCallback);
    
//     // oscServer2.on("message", msgCallback );
//     // oscServer2.on("error", msgCallback )
//     await sleep(1000);
//     const oscClient = new Client("localhost",2000);
//     oscClient.send(["/byeeahla",200,3.5]);
//     const oscClient2 = new Client("localhost",8889);
//     oscClient2.send(["/bla",200,3.5]);
// }

// startOscTest()

import {getOscInputStream,addOscOutputStream} from "./liveModel/oscInOut";

async function startOSCServer() {
   const oscInputStream= await getOscInputStream();
   console.log("got input stream",oscInputStream);
   oscInputStream.observe((m:any) => console.log(m));
}
// console.log("inputstreams",, oscOutput);
startOSCServer();

import {just} from 'most';

addOscOutputStream(just({address: "/sendAll", data:null}))
