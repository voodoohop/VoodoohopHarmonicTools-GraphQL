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

    function concatTags(data:ConvertedTagFormat[], nativeKey:string):ConvertedTagFormat[] {
         return  [...native[nativeKey].map(transformNative), ...data]
    }
    const nativeFields = nativeDataTypesAvailable.reduce<ConvertedTagFormat[]>(concatTags, []);
 
    const rawFields = nativeFields.concat(Object.keys(common).map(key => ({key, value: stringify(common[key])})));

    const findRawField = (searchKey:string):string => (rawFields.find(({key}) => (key === searchKey))||{value:undefined}).value
    const {artist, album, title, comment, bpm, genre } =  common;  
    
    const transformedEnergy = parseFloat(findRawField('TXXX:EnergyLevel'));

    const key:string = findRawField("TKEY") || findRawField("key");
   

    
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