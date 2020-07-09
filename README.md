Limited graphical user interface to FFmpeg

## Overview

This application provides the ability to convert audio/video files between
formats (the input format is limited only by the capabilities of the provided
FFmpeg binary, while the output format can be selected only among several
predefined options).

The UI is built using the popular React-based framework, Material-UI, and built
using Webpack. The project was initialized using a generator officially supported
by React developers - Create React App - to eliminate the need to configure Webpack.

Internal Node.js module `child_process` is used to spawn FFmpeg process and
capture it's output, and Xterm.js (in-browser terminal emulator) then used to
display that output to user.

## Usage

To perform the conversion, application uses FFmpeg executable specified by the user.

The procedure is as follows:
1. Specify (or select using the file manager) the path to FFmpeg in the `FFmpeg
   Executable` field.
2. Specify the path to the input file in the `Input File` field.
3. Specify the folder in which the output file will be placed in the `Output
   Directory` field.
4. Select one of the proposed formats in the `Container` field.
5. Specify the codec for the video track (the application always selects the first
   track available in the file) in the `Video Codec` field (by default, `copy` -
   save the original one), or leave the field empty to allow FFmpeg to select the
   codec automatically.
   
   Also, you can disable a video track in the output file using the switch located
   on the right side of the field.
6. Specify the codec for the audio track in the `Audio Codec` field, guided by
   the same principles you used to deal with a video codec.
7. Set the start time in the `Start Time` field in any format supported by FFmpeg
   (for example, specify `05:30` to start from position 5 minutes 30 seconds) or
   leave the field blank to start from the beginning.
8. Set the end time in the `End Time` field or leave the field blank.
9. Click on the `Start` button and observe the process of converting the file,
   or read the error message if the conversion with the given parameters is
   impossible for some reason.
   
   The process can be stopped at any time using the `Stop` button.

## Build

First you need to install application's dependencies by running the following
command in project root directory.

```bash
npm clean-install
```

Now you can start the build process:

```bash
npm run build
```

When the process completes, the built app will be located in `build` directory.