# YouTube Video Generator
Enable ​rapid creation of youtube videos by categorizing, tagging & clipping existing videos into a searchable media library

## Use Case
Creating youtube videos takes a long time. One of the most tedious parts is media sourcing - finding suitable video clips to use in your videos. Wouldn't it be great if you could just search "car chase" and get 2-10 second videos of car chases from YouTube?

This smart video generator lets you quickly find the media you want to use in your YouTube videos, saving hours of manual searching for the right footage. Use this to make your YouTube videos twice as fast!

## Example Workflow

1. You want to use a 5 second clip of a car chase in your YouTube video. You search "police car chase" with this tool. You can also search by audio, so for example if in a video someone is saying "police" but no police car is in the video itself, you will still see results with a police car chase.

2. A list of 5-10 second car chase scenes are shown to you, with thumbnails to quickly scan through the library. If you can't find what you're looking for, you can also feed this tool an existing YouTube video url and it will download the video, clip it into its independent scenes, and add metadata to make it searchable next time.

3. You download the clip you want and viola! Use it however you wish.

## Limitations

1. This tool does not handle copyright or manipulate videos in any way that will bypass YouTube content-id detection. That is up to you.

2. This tool only knows of the videos its been fed. It does not have access to videos unless it's been given access to those videos before.

## Run in development
It is highly recommended you first code in the `functions/src/sandbox/**.ts` folder before attempting to deploy to firebase. It is much faster than deploying to a dev firebase infrastructure or a local firebase simulator.

Run the below commands:
```
$ npm run export-creds
$ npm run sandbox ./src/sandbox/your-sandbox-file.ts
```

The `$ npm run export-creds` is only necessary if you plan on using the authenticated firebase client locally. The `npm run sandbox` will run `ts-node` on your sandbox typescript file, and also output the console.log to your Chrome console at `chrome://inspect/#devices` (very convinent!).

Always be verifying things work in development before ever porting it over to firebase functions.

## To Do
1. Generate the thumbnails in `functions/src/fn/sceneShots/analyzeSceneShots.fn.ts`
2. Save the scene label metadata to firestore in `functions/src/fn/addToDatabase/addToDatabase.fn.ts`
3. Fill in the placeholder helper functions in `functions/src/@api/helper.api.ts`
4. Test it in production
5. Clean up constant variable names in `functions/src/@constants/constants.ts`