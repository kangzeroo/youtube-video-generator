/** --------------------------
 *      ADD TO DATABASE
 * ---------------------------
 */

import * as functions from "firebase-functions";
import { METADATA_VIDEOS_CLOUD_BUCKET_NAME } from "@constants/constants";

const addToDatabase = functions.storage
  .bucket(METADATA_VIDEOS_CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    console.log(object);
    // onCreate of METADATA_VIDEOS_CLOUD_BUCKET_NAME
    // 1. locally download metadata
    // 2. grab sceneId from url
    // 3. find firestore record based on sceneId
    // 4. save metadata to the firestore record
  });

export default addToDatabase;
