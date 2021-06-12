export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Tag: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Query = {
  __typename?: 'Query';
  /** A simple type for getting started! */
  getScenesByTag?: Maybe<Scene>;
};


export type QueryGetScenesByTagArgs = {
  tag?: Maybe<Scalars['Tag']>;
};

export type Scene = {
  __typename?: 'Scene';
  sceneId: Scalars['String'];
  publicUrl: Scalars['String'];
  durationInSeconds?: Maybe<Scalars['Float']>;
  labels: Array<Maybe<Scalars['Tag']>>;
  thumbnails?: Maybe<Array<Maybe<Scalars['String']>>>;
};


