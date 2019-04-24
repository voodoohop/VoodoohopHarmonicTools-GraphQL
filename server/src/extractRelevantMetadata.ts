import { IAudioMetadata } from "music-metadata/lib";

import {doNormalization} from "./keyformatter";
import { Metadata } from "./types/generatedTypes";

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
 
export default function extractRelevantMetadata({native, common}:IAudioMetadata):Metadata {

    const nativeDataTypesAvailable = Object.keys(native);
    // const empty:[RawTagFormat]=[];

    function concatTags(data:ConvertedTagFormat[], nativeKey:string):ConvertedTagFormat[] {
         return  [...native[nativeKey].map(transformNative), ...data]
    }
    const nativeFields = nativeDataTypesAvailable.reduce<ConvertedTagFormat[]>(concatTags, []);
 
    const rawFields = nativeFields.concat(Object.keys(common).map(key => ({key, value: stringify(common[key])})));

    const findRawField = (searchKey:string):string => (rawFields.find(({key}) => (key === searchKey))||{value:undefined}).value
    const {artist, album, title, comment, bpm, genre } =  common;  
    
    const transformedEnergy:number = parseFloat(findRawField('TXXX:EnergyLevel'));

    const key:string = findRawField("TKEY") || findRawField("key") || findRawField("comment");
   
    console.log("key before normalization:",key);

    const normalizedKey = doNormalization(key)

    console.log("key after normalization:",normalizedKey);

    const metadata:Metadata =  {
        artist,
        album,
        title,
        rawFields,
        bpm,
        comment: comment instanceof Array ? comment.join(" ") : comment,
        musicalKey: normalizedKey,
        genre: stringify(genre),
        energy: transformedEnergy        
    };

    return metadata;    
}