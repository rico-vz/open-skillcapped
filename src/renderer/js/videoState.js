const PLYR_CONTROLS = [
    'play-large', 'play', 'progress', 'current-time',
    'duration', 'mute', 'volume', 'settings',
    'pip', 'airplay', 'fullscreen'
];

const HLS_CONFIG = {
    maxBufferSize: 0,
    maxBufferLength: 30,
    startPosition: 0
};

class VideoPlayerState {
    constructor() {
        this.hls = null;
        this.player = null;
        this.currentVideoId = null;
        this.video = null;
        this.statusLabel = null;
    }

    initialize() {
        this.video = document.querySelector('#video');
        this.statusLabel = document.getElementById('status');
        this.initializePlyr();
        this.initializeHLS();
    }

    initializePlyr() {
        this.player = new Plyr(this.video, { controls: PLYR_CONTROLS });
    }

    initializeHLS() {
        if (!Hls.isSupported()) return;

        this.hls = new Hls(HLS_CONFIG);
        this.setupHLSEventHandlers();
    }

    setupHLSEventHandlers() {
        this.hls.on(Hls.Events.ERROR, (event, data) => this.handleHLSError(data));
    }

    handleHLSError(data) {
        if (!data.fatal) return;

        switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                this.hls.startLoad();
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                this.hls.recoverMediaError();
                break;
            default:
                this.initializeHLS();
                break;
        }
    }
}