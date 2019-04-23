import apolloServer from 'apollo-server';

const { ApolloServer, gql, PubSub } = apolloServer;

import musicMetadata from "music-metadata"

const {parseFile: parseAudioFileMetadata} = musicMetadata;

import DataLoader from 'dataloader';

const pubsub = new PubSub();

const HELLO_ADDED = 'HELLO_ADDED';

import {getKeyFormatter} from "./keyformatter.js";
import extractRelevantMetadata from './extractRelevantMetadata.js';


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

const audioMetadataLoader = new DataLoader(path => {
    console.log("I got", path);
    return Promise.all(path.map(path => parseAudioFileMetadata(path, {native: true})));
}, {batch:false});
// Prove resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',  
    audioFile: async (_root, {path}) => {
        console.log("returning metadata for path", path);
        const metadata = extractRelevantMetadata(await audioMetadataLoader.load(path));
        console.log("returning fields",metadata); 
        return {path, metadata}
    },
  },
  Metadata: {
    field: ({rawFields},{key: searchKey}) => {     
        // console.log("getting subdata",fields, key);
        const selectedField = rawFields.find(({key}) => key === searchKey )
        return ""+selectedField.value;
    },
    musicalKey: (obj, {notation}) => {
        console.log("args", obj, notation);
        return getKeyFormatter(notation)(obj.key);                 
    }
  },
  Subscription: {
      helloAdded: {subscribe: () => pubsub.asyncIterator([HELLO_ADDED])}
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});

setInterval(() =>{
    console.log("hello");
     pubsub.publish(HELLO_ADDED, {helloAdded: "hello"})
}, 50000)