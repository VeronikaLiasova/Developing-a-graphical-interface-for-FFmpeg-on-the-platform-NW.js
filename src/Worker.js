import { spawn } from 'child_process';
import { resolve, extname, basename } from 'path';

export default class Worker {
    constructor(onOutput, onCompletion) {
        this.onOutput = onOutput;
        this.onCompletion = onCompletion;
    }

    start({
        ffmpegExecutable,
        inputFile,
        outputDir,
        container,
        videoCodec,
        outputVideo,
        audioCodec,
        outputAudio,
        startTime,
        endTime,
    }) {
        if (this.running) {
            return;
        }

        this.onOutput(null);

        const args = [ '-y', '-nostdin', '-i', inputFile ];

        if (outputVideo) {
            args.push('-map', '0:v:0');

            if (videoCodec) {
                args.push('-c:v', videoCodec);
            }
        }

        if (outputAudio) {
            args.push('-map', '0:a:0');

            if (audioCodec) {
                args.push('-c:a', audioCodec);
            }
        }

        if (startTime) {
            args.push('-ss', startTime);
        }

        if (endTime) {
            args.push('-to', endTime);
        }

        const filename = basename(inputFile, extname(inputFile));
        const outputFile = resolve(outputDir, `${filename}_processed.${container}`);

        args.push(outputFile);

        try {
            const ffmpeg = spawn(ffmpegExecutable, args);

            ffmpeg.stdout.on('data', (data) => {
                this.onOutput(data.toString());
            });

            ffmpeg.stderr.on('data', (data) => {
                this.onOutput(data.toString());
            });

            ffmpeg.on('exit', () => {
                this.cleanup();
                this.onCompletion();
            });

            this.ffmpeg = ffmpeg;
            this.running = true;
        } catch (error) {
            this.onCompletion();
            this.onOutput(`Failed to spawn FFmpeg process:\n${error}`);
        }
    }

    stop() {
        if (!this.running) {
            return;
        }

        this.ffmpeg.kill('SIGINT');
        this.cleanup();
    };

    cleanup() {
        this.running = false;
        this.ffmpeg = null;
    }
}
