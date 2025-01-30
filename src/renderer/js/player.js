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
        this.state.statusLabel.innerText = 'Downloading...';

        try {
            for (let i = 1; i <= MAX_PARTS; i++) {
                const tsUrl = `${CLOUDFRONT_URL}/${this.state.currentVideoId}/HIDDEN${selectedResolution}-${String(i).padStart(5, '0')}.ts`;

                const resp = await fetch(tsUrl);
                if (resp.status !== 200) break;

                const tsData = await resp.arrayBuffer();
                tsFileContents.push(tsData);
            }

            if (tsFileContents.length === 0) {
                throw new Error('Error downloading video parts');
            }

            await this.createAndDownloadBlob(tsFileContents);

            this.state.statusLabel.innerText = 'Finished';
            setTimeout(() => {
                this.state.statusLabel.innerText = '';
            }, 1000);

        } catch (error) {
            this.state.statusLabel.innerText = error.message;
        }
    }

    createAndDownloadBlob(tsFileContents) {
        const mergedVideoBlob = new Blob(tsFileContents, { type: 'video/mp2t' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(mergedVideoBlob);
        downloadLink.download = `${this.state.currentVideoId}.ts`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}

const videoPlayer = new VideoPlayer();
videoPlayer.initialize();

window.stream = () => videoPlayer.stream();
window.downloadAndMergeVideo = () => videoPlayer.downloadAndMergeVideo();