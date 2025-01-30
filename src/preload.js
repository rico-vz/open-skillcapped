const { contextBridge, ipcRenderer } = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const temp = require('temp');
const fs = require('fs');
const path = require('path');

temp.track();

ffmpeg.setFfmpegPath(ffmpegPath);

contextBridge.exposeInMainWorld('converter', {
    convertToMp4: async (tsBuffer) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await ipcRenderer.invoke('show-save-dialog');

                if (result.canceled) {
                    resolve({ canceled: true });
                    return;
                }

                const tempFile = temp.path({ suffix: '.ts' });
                fs.writeFileSync(tempFile, Buffer.from(tsBuffer));

                const outputPath = result.filePath;

                ffmpeg(tempFile)
                    .outputOptions('-c:v', 'copy', '-c:a', 'copy')
                    .save(outputPath)
                    .on('end', () => {
                        resolve({ canceled: false, filePath: outputPath });
                    })
                    .on('error', (err) => {
                        reject(new Error(`Error converting video: ${err.message}`));
                    });
            } catch (err) {
                reject(new Error(`Error in conversion process: ${err.message}`));
            }
        });
    }
});