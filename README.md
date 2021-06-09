# YouTube Video Generator

This app turns text into a YouTube video. Multiple scenes are generated based on text keywords or phrases you select, such as "dog chasing ball". If you don't like a scene, the app will offer alternatives until you are satisfied. 

Use this app to generate video content in mass. This is a better alternative to www.Lumen5.com which does not allow you to pick which word/phrases to generate scenes from.

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
1. Test it in production
2. Move out API keys to environment variables