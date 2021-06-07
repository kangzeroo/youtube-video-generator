// dev mode for --> functions/src/@api/thumbnail-preview.api.ts
import path from "path";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

const extractPreviewImage = (
  inFilePath: string,
  outDir: string,
  width = 320
): Promise<string[]> => {
  const savedFileNames: string[] = [];
  console.log(width);

  try {
    const cmd = ffmpeg(inFilePath)
      .screenshots({
        timemarks: ["10%", "30%", "50%", "80%"],
        size: `${width}x?`,
        folder: outDir,
      })
      .on("filenames", (filenames) => {
        console.log("Will generate " + filenames.join(", "));
        filenames.forEach((n: string) => savedFileNames.push(n));
      });
    return new Promise((resolve, reject) => {
      cmd.on("end", () => {
        console.log("resolving.. end");
        resolve(savedFileNames);
      });
      cmd.on("error", reject);
    });
  } catch (e) {
    throw Error(e);
  }
};

export const makePreviewImages = async (): Promise<void> => {
  // Temporarily download the video.
  const videoPath = path.join(__dirname, "test-video.mp4");
  console.log(videoPath);
  //   const videoId = "local-test";
  const fileNames: string[] = [];

  try {
    const names: string[] = await extractPreviewImage(videoPath, __dirname);
    names.forEach((n) => fileNames.push(n));
  } catch (err) {
    throw Error(err);
  }

  if (fileNames.length > 0) {
    // Clean up!
    // fs.unlinkSync(videoPath);
    // fs.unlinkSync(`${__dirname}/thumbnail.png`);
  } else {
    // Clean up!
    // fs.unlinkSync(videoPath);
    // fs.unlinkSync(`${__dirname}/thumbnail.png`);
    throw Error("Failed to generate thumbnails, no names");
  }
};

makePreviewImages();
