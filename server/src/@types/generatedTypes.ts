export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AbletonLiveControls = {
  keyNotation?: Maybe<KeyNotation>;
  visibility?: Maybe<Scalars["Boolean"]>;
  updateClipNames?: Maybe<Scalars["Boolean"]>;
  updateClipColors?: Maybe<Scalars["Boolean"]>;
  masterTempo?: Maybe<Scalars["Float"]>;
};

export type AbletonLiveState = {
  controls: AbletonLiveControls;
};

export type AudioFile = {
  path: Scalars["ID"];
  metadata?: Maybe<Metadata>;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

export enum KeyNotation {
  Traditional = "TRADITIONAL",
  Camelot = "CAMELOT",
  Openkey = "OPENKEY"
}

export type Metadata = {
  title?: Maybe<Scalars["String"]>;
  artist?: Maybe<Scalars["String"]>;
  musicalKey?: Maybe<Scalars["String"]>;
  bpm?: Maybe<Scalars["Float"]>;
  album?: Maybe<Scalars["String"]>;
  comment?: Maybe<Scalars["String"]>;
  genre?: Maybe<Scalars["String"]>;
  energy?: Maybe<Scalars["Float"]>;
  rawFields: Array<RawMetadata>;
  field?: Maybe<Scalars["String"]>;
};

export type MetadataMusicalKeyArgs = {
  notation: KeyNotation;
};

export type MetadataFieldArgs = {
  key: Scalars["String"];
};

export type Query = {
  hello?: Maybe<Scalars["String"]>;
  audioFile?: Maybe<AudioFile>;
  live?: Maybe<AbletonLiveState>;
};

export type QueryAudioFileArgs = {
  path: Scalars["String"];
};

export type RawMetadata = {
  key: Scalars["String"];
  value: Scalars["String"];
};

export type Subscription = {
  helloAdded?: Maybe<Scalars["String"]>;
  liveState?: Maybe<AbletonLiveState>;
};

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: {};
  String: Scalars["String"];
  AudioFile: AudioFile;
  ID: Scalars["ID"];
  Metadata: Metadata;
  KeyNotation: KeyNotation;
  Float: Scalars["Float"];
  RawMetadata: RawMetadata;
  AbletonLiveState: AbletonLiveState;
  AbletonLiveControls: AbletonLiveControls;
  Boolean: Scalars["Boolean"];
  Subscription: {};
  CacheControlScope: CacheControlScope;
  Upload: Scalars["Upload"];
  Int: Scalars["Int"];
}>;

export type CacheControlDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    maxAge?: Maybe<Maybe<Scalars["Int"]>>;
    scope?: Maybe<Maybe<CacheControlScope>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbletonLiveControlsResolvers<
  ContextType = any,
  ParentType = ResolversTypes["AbletonLiveControls"]
> = ResolversObject<{
  keyNotation?: Resolver<
    Maybe<ResolversTypes["KeyNotation"]>,
    ParentType,
    ContextType
  >;
  visibility?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  updateClipNames?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  updateClipColors?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  masterTempo?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
}>;

export type AbletonLiveStateResolvers<
  ContextType = any,
  ParentType = ResolversTypes["AbletonLiveState"]
> = ResolversObject<{
  controls?: Resolver<
    ResolversTypes["AbletonLiveControls"],
    ParentType,
    ContextType
  >;
}>;

export type AudioFileResolvers<
  ContextType = any,
  ParentType = ResolversTypes["AudioFile"]
> = ResolversObject<{
  path?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  metadata?: Resolver<
    Maybe<ResolversTypes["Metadata"]>,
    ParentType,
    ContextType
  >;
}>;

export type MetadataResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Metadata"]
> = ResolversObject<{
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  artist?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  musicalKey?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    MetadataMusicalKeyArgs
  >;
  bpm?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  album?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  genre?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  energy?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  rawFields?: Resolver<
    Array<ResolversTypes["RawMetadata"]>,
    ParentType,
    ContextType
  >;
  field?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    MetadataFieldArgs
  >;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Query"]
> = ResolversObject<{
  hello?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  audioFile?: Resolver<
    Maybe<ResolversTypes["AudioFile"]>,
    ParentType,
    ContextType,
    QueryAudioFileArgs
  >;
  live?: Resolver<
    Maybe<ResolversTypes["AbletonLiveState"]>,
    ParentType,
    ContextType
  >;
}>;

export type RawMetadataResolvers<
  ContextType = any,
  ParentType = ResolversTypes["RawMetadata"]
> = ResolversObject<{
  key?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Subscription"]
> = ResolversObject<{
  helloAdded?: SubscriptionResolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  liveState?: SubscriptionResolver<
    Maybe<ResolversTypes["AbletonLiveState"]>,
    ParentType,
    ContextType
  >;
}>;

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type Resolvers<ContextType = any> = ResolversObject<{
  AbletonLiveControls?: AbletonLiveControlsResolvers<ContextType>;
  AbletonLiveState?: AbletonLiveStateResolvers<ContextType>;
  AudioFile?: AudioFileResolvers<ContextType>;
  Metadata?: MetadataResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RawMetadata?: RawMetadataResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
}>;

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<
  ContextType
>;
