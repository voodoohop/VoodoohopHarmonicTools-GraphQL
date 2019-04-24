import { IAudioMetadata } from "music-metadata/lib";


function stringify(o) {
    return o instanceof Array ? o.join(",") : (o !== Object(o) ? o : JSON.stringify(o))   
}

interface RawTagFormat {
    id:string,
    value:string
}
interface ConvertedTagFormat {
    key:string,
    value:string
}
const transformNative = ({id,value}:RawTagFormat):ConvertedTagFormat => ({key:id,value: stringify(value)});        
 
export default function extractRelevantMetadata({native, common}:IAudioMetadata) {

    const nativeDataTypesAvailable = Object.keys(native);
    // const empty:[RawTagFormat]=[];
    const nativeFields = nativeDataTypesAvailable.reduce<[ConvertedTagFormat]>((data:[ConvertedTagFormat], nativeKey:string):[ConvertedTagFormat] => [...data, ...native[nativeKey].map(transformNative) ], []]);
 
    const rawFields = nativeFields.concat(Object.keys(common).map(key => ({key, value: stringify(common[key])})));

    const {artist, album, title, comment, bpm, key, genre, energy} =  common;  
    
    const transformedEnergy = parseFloat((rawFields.find(({key}) => (key === 'TXXX:EnergyLevel'))||{}).value);
   
    const metadata =  {
        artist,
        album,
        title,
        rawFields,
        bpm,
        comment: comment instanceof Array ? comment.join(" ") : comment,
        key,
        genre: stringify(genre),
        energy: transformedEnergy        
    };

    return metadata;    
}