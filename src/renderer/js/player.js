class VideoPlayer {
    constructor() {
        this.state = new VideoPlayerState();
    }

    initialize() {
        this.state.initialize();
    }

    async stream() {
        if (!this.state.hls) {
            alert('[??] Somehow HLS is not supported in this build. Create an issue on GitHub.');
            return;
        }

        try {
            const rawUrl = document.getElementById('url').value;
            const videoId = VideoUtils.extractVideoId(rawUrl);

            if (!videoId) {
                alert('Bad URL');
                return;
            }

            this.state.currentVideoId = videoId;

            const lastPart = await VideoUtils.findLastPart(videoId,
                status => this.state.statusLabel.innerText = status);

            this.state.statusLabel.innerText = '';
            const m3u8Data = VideoUtils.generateM3U8(videoId, lastPart);

            document.getElementById('videoSection').classList.remove('hidden');
            this.loadVideo(m3u8Data);

        } catch (error) {
            alert(error.message);
        }
    }

    loadVideo(m3u8Data) {
        if (!Hls.isSupported()) return;

        this.state.hls.loadSource('data:application/x-mpegURL;base64,' + btoa(m3u8Data));
        this.state.hls.attachMedia(this.state.video);
    }

    async downloadAndMergeVideo() {
        if (!this.state.currentVideoId) {
            this.state.statusLabel.innerText = 'Please stream a video first';
            return;
        }

        const selectedResolution = document.getElementById('resolution').value;
        const tsFileContents = [];
        let totalParts = 0;

        try {
            for (let i = 1; i <= MAX_PARTS; i++) {
                const tsUrl = `${CLOUDFRONT_URL}/${this.state.currentVideoId}/HIDDEN${selectedResolution}-${String(i).padStart(5, '0')}.ts`;
                const resp = await fetch(tsUrl, { method: 'HEAD' });
                if (resp.status !== 200) break;
                totalParts = i;
            }

            this.state.statusLabel.innerText = 'Downloading...';

            for (let i = 1; i <= totalParts; i++) {
                const tsUrl = `${CLOUDFRONT_URL}/${this.state.currentVideoId}/HIDDEN${selectedResolution}-${String(i).padStart(5, '0')}.ts`;
                const resp = await fetch(tsUrl);
                if (resp.status !== 200) break;

                const tsData = await resp.arrayBuffer();
                tsFileContents.push(new Uint8Array(tsData));

                const progress = Math.round((i / totalParts) * 100);
                this.state.statusLabel.innerText = `Downloading... ${progress}%`;
            }

            if (tsFileContents.length === 0) {
                throw new Error('Error downloading video parts');
            }

            this.state.statusLabel.innerText = 'Merging files...';
            const mergedTsData = new Uint8Array(tsFileContents.reduce((acc, curr) => acc + curr.length, 0));
            let offset = 0;
            for (const tsData of tsFileContents) {
                mergedTsData.set(tsData, offset);
                offset += tsData.length;
            }

            this.state.statusLabel.innerText = 'Converting to MP4...';
            const result = await window.converter.convertToMp4(mergedTsData);

            if (result.canceled) {
                this.state.statusLabel.innerText = 'Download cancelled';
                setTimeout(() => {
                    this.state.statusLabel.innerText = '';
                }, 2000);
                return;
            }

            this.state.statusLabel.innerText = 'Download complete!';
            setTimeout(() => {
                this.state.statusLabel.innerText = '';
            }, 2000);

        } catch (error) {
            this.state.statusLabel.innerText = error.message;
            console.error('Download error:', error);
        }
    }
}

const videoPlayer = new VideoPlayer();
videoPlayer.initialize();

window.stream = () => videoPlayer.stream();
window.downloadAndMergeVideo = () => videoPlayer.downloadAndMergeVideo();