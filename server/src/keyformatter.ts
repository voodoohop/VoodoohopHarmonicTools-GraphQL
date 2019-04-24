import { Maybe } from "./@types/generatedTypes";

type StringMap = { [key: string]: string };


type ConvertString = (input:string) => string;

const openkeySequence = [
    "B",
    "F#",
    "C#",
    "G#",
    "D#",
    "A#",
    "F",
    "C",
    "G",
    "D",
    "A",
    "E",
  ];


  
  const camelotToKey:StringMap = {
    "11b": "A",
    "8a": "Am",
    "6b": "A#",
    "3a": "A#m",
    "1b": "B",
    "10a": "Bm",
    "8b": "C",
    "5a": "Cm",
    "3b": "C#",
    "12a": "C#m",
    "10b": "D",
    "7a": "Dm",
    "5b": "D#",
    "2a": "D#m",
    "12b": "E",
    "9a": "Em",
    "7b": "F",
    "4a": "Fm",
    "2b": "F#",
    "11a": "F#m",
    "9b": "G",
    "6a": "Gm",
    "4b": "G#",
    "1a": "G#m"
  }
  
  const openKeyToKey:StringMap = {
    "4d": "A",
    "1m": "Am",
    "11d": "A#",
    "8m": "A#m",
    "6d": "B",
    "3m": "Bm",
    "1d": "C",
    "8d": "C#",
    "5m": "C#m",
    "3d": "D",
    "12m": "Dm",
    "10d": "D#",
    "7m": "D#m",
    "5d": "E",
    "2m": "Em",
    "12d": "F",
    "9m": "Fm",
    "7d": "F#",
    "4m": "F#m",
    "2d": "G",
    "11m": "Gm",
    "9d": "G#",
    "6m": "G#m"
  }
  
  const keysToCam:StringMap  = {
    "c": "8b",
    "am": "8a",
    "g": "9b",
    "em": "9a",
    "d": "10b",
    "bm": "10a",
    "a": "11b",
    "gbm": "11a",
    "f#m": "11a",
    "e": "12b",
    "dbm": "12a",
    "c#m": "12a",
    "b": "1b",
    "abm": "1b",
    "g#m": "1a",
    "gb": "2b",
    "f#": "2b",
    "d#m": "2a",
    "ebm": "2a",
    "db": "3b",
    "c#": "3b",
    "bbm": "3a",
    "a#m": "3a",
    "ab": "4b",
    "g#": "4b",
    "fm": "4a",
    "eb": "5b",
    "d#": "5b",
    "cm": "5a",
    "bb": "6b",
    "a#": "6b",
    "gm": "6a",
    "f": "7b",
    "dm": "7a"
  };
  
  const camToOpenKey:StringMap = {
    "8b": "1d",
    "8a": "1m",
    "9b": "2d",
    "9a": "2m",
    "10b": "3d",
    "10a": "3m",
    "11b": "4d",
    "11a": "4m",
    "12b": "5d",
    "12a": "5m",
    "1b": "6d",
    "1a": "6m",
    "2b": "7d",
    "2a": "7m",
    "3b": "8d",
    "3a": "8m",
    "4b": "9d",
    "4a": "9m",
    "5b": "10d",
    "5a": "10m",
    "6b": "11d",
    "6a": "11m",
    "7b": "12d",
    "7a": "12m"
  }
  
  const normalizeKeys:StringMap = {
    "c": "C",
    "am": "Am",
    "g": "G",
    "em": "Em",
    "d": "D",
    "bm": "Bm",
    "a": "A",
    "gbm": "Gbm",
    "f#m": "Gbm",
    "e": "E",
    "dbm": "Dbm",
    "c#m": "Dbm",
    "b": "B",
    "abm": "Abm",
    "g#m": "Abm",
    "gb": "Gb",
    "f#": "Gb",
    "d#m": "Ebm",
    "ebm": "Ebm",
    "db": "Db",
    "c#": "Db",
    "bbm": "Bbm",
    "a#m": "Bbm",
    "ab": "Ab",
    "g#": "Ab",
    "fm": "Fm",
    "eb": "Eb",
    "d#": "Eb",
    "cm": "Cm",
    "bb": "Bb",
    "a#": "Bb",
    "gm": "Gm",
    "f": "F",
    "dm": "Dm"
  };
  
 export const keysToCamelot:ConvertString = (key:string):string => keysToCam[key.toLowerCase()]

  
 export  const keysToOpenkey:ConvertString = (key:string):string => camToOpenKey[keysToCamelot(key)];
  
  
  export const keysNormalize:ConvertString = (key:string) => key ? normalizeKeys[key.toLowerCase()] : "undefined"
  // const logInOut = (notation,keyFormatter) => (key) => {     const result =f
  // keyFormatter(key);     console.log("formatting key", key, "result:",
  // result,"notation:",notation,keyFormatter);     // console.trace();     return
  // result; }
  const identity:ConvertString = (key) => key;
  
 export const getKeyFormatter = (keyNotation: Maybe<string>):ConvertString => {
    const notation = keyNotation || "TRADITIONAL";
    if (notation === "CAMELOT")
      return keysToCamelot;
    if (notation === "OPENKEY")
      return keysToOpenkey;
    return keysNormalize;//.replace("b", '\u266D').replace("#", '\u266F');
  }
  


const majorMinorFormat = (m:string):string => {
    if (!m)
      return "";
    if (m.slice(0, 3) === "maj")
      return "";
    if (m.slice(0, 3) === "min")
      return "m";
    return m || "";
  };

  
  
  const keyRegEx = /\b\s*([A-G])(#|B)?\s?((?:maj|min)(?:or)?|(?:m))?\b.*/i;
  
  const camelotRegEx = /\b\s*((?:1[0-2]|[1-9])(?:a|b))\b.*/i;
  
  const openKeyRegEx = /\b\s*((?:1[0-2]|[1-9])(?:d|m))\b.*/i;

const safeDoKeyNormalize = (matches: Maybe<RegExpMatchArray>):Maybe<string> => matches === null ? null : doKeyNormalize(matches);
const doKeyNormalize = ([_, keyName, flatOrSharp, majorMinor]:RegExpMatchArray) => `${(keyName || "").toUpperCase()}${(flatOrSharp || "")}${majorMinorFormat(majorMinor)}`

const safeLookupSecond = (map:StringMap, matches: Maybe<RegExpMatchArray>):Maybe<string> => matches === null ? null: map[matches[1]];

const normalize = (keyString:string, keyRegEx:RegExp, camelotRegEx:RegExp, openKeyRegEx:RegExp):Maybe<string> =>
  keyRegEx.test(keyString) ?
    safeDoKeyNormalize(keyString.toLowerCase().match(keyRegEx))
    :
    camelotRegEx.test(keyString) ?
      safeLookupSecond(camelotToKey, keyString.toLowerCase().match(camelotRegEx))
      : (
        (openKeyRegEx.test(keyString) ? safeLookupSecond(openKeyToKey,keyString.toLowerCase().match(openKeyRegEx))
          : null));

export const doNormalization = (possibleKeyString:string):Maybe<string> => normalize(possibleKeyString, keyRegEx, camelotRegEx, openKeyRegEx);

// const doNormalization_filename = (possibleKeyString) => normalize(possibleKeyString, keyRegEx_filename, camelotRegEx_filename, openKeyRegEx_filename);

// const normalizeKeyFormat = (data, path) => {
//   // console.log("trying to update ",data, data.getIn(["metadata","initialkey"]));
//   const id3Tried =
//     data.updateIn(["metadata", "initialkey"],
//       data.getIn(["metadata", "key"], data.getIn(["metadata", "comment"]) || ""),
//       doNormalization
//     )
//       .update("metadata", md => md.filter((v, k) => v !== undefined));
//   // console.log("after try ",id3Tried.getIn(["metadata","initialkey"]));  
//   const filename = path.split("/").reverse()[0].toLowerCase();
//   console.log("trying to extract metadata from filename", filename, doNormalization(filename));
//   return id3Tried.updateIn(["metadata", "initialkey"], (before) => before || doNormalization(filename));
// }



