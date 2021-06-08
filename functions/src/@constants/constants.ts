export const USER_ID = "default-user";
export const PLACEHOLDER_FILENAME = (() => {
  return "missing-value-placeholder";
})();

// where we store raw videos
export const RAW_VIDEOS_CLOUD_BUCKET = "gs://raw-videos-prod";
export const RAW_VIDEOS_CLOUD_BUCKET_NAME = "raw-videos-prod";
// where we store video thumbnails
export const PROCESSED_VIDEOS_CLOUD_BUCKET = "gs://processed-videos-prod";
export const PROCESSED_VIDEOS_CLOUD_BUCKET_NAME = "processed-videos-prod";
// where we store video metadata
export const METADATA_VIDEOS_CLOUD_BUCKET = "gs://metadata-videos-prod";
export const METADATA_VIDEOS_CLOUD_BUCKET_NAME = "metadata-videos-prod";

// algolia
export const ALGOLIA_APPID = "V5EOCVB518";
export const ALGOLIA_ADMIN_APIKEY = "5adbb4f7edf100dd84cd622acdbd67cf";
export const ALGOLIA_SEARCH_KEY = "04cd49a4741e95ef3d28c47011e31974";
export const ALGOLIA_INDEX = "DEFAULT_INDEX";
