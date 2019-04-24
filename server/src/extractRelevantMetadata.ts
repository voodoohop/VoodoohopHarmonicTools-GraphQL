import { IAudioMetadata } from "music-metadata/lib";

import {doNormalization} from "./keyformatter";
import { Metadata, Maybe } from "./@types/generatedTypes";

function stringify(o:any):string {
    return o instanceof Array ? o.join(",") : (o !== Object(o) ? ""+o : JSON.stringify(o))   
}

interface RawTagFormat {
    id:string,
    value:string
}
interface ConvertedTagFormat {
    key:string,
    value:string
}

interface AnyArray {
    [index: string]: any;
}

const transformNative = ({id,value}:RawTagFormat):ConvertedTagFormat => ({key:id,value: stringify(value)});        
 
export default function extractRelevantMetadata({native, common}:IAudioMetadata):Metadata {

    const nativeDataTypesAvailable = Object.keys(native);
    // const empty:[RawTagFormat]=[];

    function concatTags(data:ConvertedTagFormat[], nativeKey:string):ConvertedTagFormat[] {
         return  [...native[nativeKey].map(transformNative), ...data]
    }
    const nativeFields = nativeDataTypesAvailable.reduce<ConvertedTagFormat[]>(concatTags, []);
 
    const rawFields = nativeFields.concat(Object.keys(common).map((key:string):ConvertedTagFormat => {
       
    
        const commonValue:any = (common as AnyArray)[key]; 
     const value = stringify(commonValue);
     return ({key, value});
    }));

    const findRawField = (searchKey:string):Maybe<string> => (rawFields.find(({key}) => (key === searchKey))||{value:null}).value
    const {artist, album, title, comment, bpm, genre } =  common;  
    
    const rawEnergy = findRawField('TXXX:EnergyLevel'); 

    const transformedEnergy:Maybe<number> = rawEnergy === null ? null: parseFloat(rawEnergy);

    const key:Maybe<string> = findRawField("TKEY") || findRawField("key") || findRawField("comment") || null;
   
    console.log("key before normalization:",key);

    const normalizedKey:Maybe<string> = key === null ? null : doNormalization(key);

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