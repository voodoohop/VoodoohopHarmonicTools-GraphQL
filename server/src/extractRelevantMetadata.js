

function stringify(o) {
    return o instanceof Array ? o.join(",") : (o !== Object(o) ? o : JSON.stringify(o))   
}

const transformNative = ({id,value}) => ({key:id,value: stringify(value)});        
 
export default function extractRelevantMetadata({native, common}) {

    const nativeDataTypesAvailable = Object.keys(native);
     
    const nativeFields = nativeDataTypesAvailable.reduce((data, nativeKey) => [...data, ...native[nativeKey].map(transformNative) ], []);
 
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