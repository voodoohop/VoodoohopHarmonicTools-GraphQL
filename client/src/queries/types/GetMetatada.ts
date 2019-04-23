/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMetatada
// ====================================================

export interface GetMetatada_audioFile_metadata_fields {
  __typename: "RawMetadata";
  key: string | null;
  value: string | null;
}

export interface GetMetatada_audioFile_metadata {
  __typename: "Metadata";
  artist: string | null;
  title: string | null;
  album: string | null;
  musicalKey: string | null;
  fields: (GetMetatada_audioFile_metadata_fields | null)[] | null;
}

export interface GetMetatada_audioFile {
  __typename: "AudioFile";
  metadata: GetMetatada_audioFile_metadata | null;
}

export interface GetMetatada {
  audioFile: GetMetatada_audioFile | null;
}

export interface GetMetatadaVariables {
  filepath: string;
}
