// data/queries/JAWN_QUERY.ts
import gql from "graphql-tag";

export default gql`
query GetMetatada($filepath: String!) {
  audioFile(path: $filepath) {  
  	metadata {
		artist
        title
        album
        musicalKey(notation: TRADITIONAL)
        fields {
          key
          value
        }
        #description: field(key:"DESCRIPTION")
      }
  	}
}
`;