import algoliasearch from "algoliasearch";
import { hashCode as encode } from "hashcode";
import * as dotenv from "dotenv";
dotenv.config();
import {
  ALGOLIA_APPID,
  ALGOLIA_ADMIN_APIKEY,
  //   ALGOLIA_SEARCH_KEY,
  ALGOLIA_INDEX,
} from "@constants/constants";

// export const getKey = async (userId: string): Promise<string> => {
//   const params = {
//     // This filter ensures that only documents
//     // where author == user_id will be readable
//     filters: userId,
//     // We also proxy the user_id as a unique token for this key.
//     userToken: userId,
//   };

//   const client = algoliasearch(ALGOLIA_APPID, ALGOLIA_ADMIN_APIKEY);

//   // Call the Algolia API to generate a unique key based on our search key
//   const key = await client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, params);
//   return key;
// };

// export const search = async (
//   query,
//   userId: string
// ): Promise<Array<{ videoId: string; userId: string }>> => {
//   /* In Algolia, we associatete records with users by storing
//   userId as a tag. Here, we userids from algolia records */
//   const _getUserid = (tags: string[]) => {
//     return tags.filter((tag: string) => {
//       return tag != "transcript" && tag != "entity" && tag != "text";
//     })[0];
//   };
//   const client = algoliasearch(ALGOLIA_APPID, ALGOLIA_ADMIN_APIKEY);
//   const index = client.initIndex(ALGOLIA_INDEX);
//   const res = await index.search(query, {
//     tagFilters: [userId],
//     attributesToRetrieve: ["videoId", "transcript", "text", "entity", "_tags"],
//   });
//   if (!res.nbHits) return [];
//   return res.hits
//     .filter((hit, index) => {
//       return res.hits.findIndex((h) => h.videoId == hit.videoId) == index;
//     })
//     .map((hit) => {
//       return { videoId: hit["videoId"], userId: _getUserid(hit["_tags"]) };
//     });
// };

type TTranscriptJson = any;
type TShotLabelJson = any;
type TTranscriptJsonObj = any;
type TAnnotationType = string;

export const save = async (
  userId: string,
  videoId: string,
  transcriptJson: TTranscriptJson,
  shotLabelJson: TShotLabelJson
): Promise<void> => {
  const _generateId = (
    obj: TTranscriptJsonObj,
    annotationType: TAnnotationType
  ) => {
    // A unique ID to prevent duplicates
    return Math.abs(
      encode().value(
        videoId.toString() +
          (obj.text || obj.entity || obj.transcript) +
          obj.start_time +
          annotationType
      )
    );
  };

  const client = algoliasearch(ALGOLIA_APPID, ALGOLIA_ADMIN_APIKEY);
  const index = client.initIndex(ALGOLIA_INDEX);
  console.log(
    `Createtd algolia index client for index ${process.env.ALOGLIA_INDEX}`
  );

  // Adding tags lets us restrict values by user, and search by annotation type.
  const _addMeta = (
    inJson: TTranscriptJson,
    annotationType: TAnnotationType
  ) => {
    return inJson.map((obj: TTranscriptJsonObj) => {
      return {
        ...obj,
        _tags: [userId, annotationType],
        videoId: videoId,
        objectID: _generateId(obj, annotationType),
      };
    });
  };

  // Add userId and category tag
  // Save them to Algolia
  try {
    await index.saveObjects(_addMeta(transcriptJson, "transcript"));
  } catch (err) {
    console.log(err);
  }
  await index.saveObjects(_addMeta(shotLabelJson, "shots"));
};
