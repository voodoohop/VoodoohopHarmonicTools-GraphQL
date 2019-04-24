import { ApolloServer, gql, PubSub }  from 'apollo-server';

import {parseFile as parseAudioFileMetadata, IAudioMetadata} from "music-metadata"


import DataLoader = require('dataloader');

const pubsub = new PubSub();

const HELLO_ADDED = 'HELLO_ADDED';

import {getKeyFormatter} from "./keyformatter";
import extractRelevantMetadata from './extractRelevantMetadata';

import {QueryResolvers, MetadataResolvers, Resolvers, AudioFile} from "./types/generatedTypes";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

    enum ChordNotation {
        TRADITIONAL
        CAMELOT
        OPENKEY
    }

    type RawMetadata {
        key: String
        value: String
    }

    type Metadata {
        title: String
        artist: String
        musicalKey(notation:ChordNotation = TRADITIONAL): String
        bpm: String
        album: String
        comment: String
        genre: String
        energy: Float
        rawFields: [RawMetadata],
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
    audioFile: async (_:any, {path} :{path:string}) => {
        console.log("returning metadata for path", path);
        const metadata = extractRelevantMetadata(await audioMetadataLoader.load(path));
        console.log("returning fields",metadata);   
        const result:AudioFile = {path, metadata};   
        return result;
    },
  }

const metadataResolvers:MetadataResolvers = {
    field: ({rawFields},{key: searchKey}) => {     
        // console.log("getting subdata",fields, key);
        const selectedField = rawFields.find(({key}) => key === searchKey )
        return ""+selectedField.value;
    },
    musicalKey: (obj, {notation}) => {
        console.log("args", obj, notation);
        return getKeyFormatter(notation)(obj.musicalKey);                 
    }
  };



const resolvers:Resolvers= {
  Query: queryResolvers,
  Metadata: metadataResolvers,
  Subscription: {
      helloAdded: {subscribe: () => pubsub.asyncIterator([HELLO_ADDED])}
  }
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
console.log(child);