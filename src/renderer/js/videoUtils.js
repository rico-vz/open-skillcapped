const CLOUDFRONT_URL = 'https://d13z5uuzt1wkbz.cloudfront.net';
const VIDEO_ID_REGEX = /([a-z0-9]{10})(:?\/|$)/g;
const MAX_PARTS = 1000;
const CHUNK_SIZE = 50;

class VideoUtils {
    static extractVideoId(url) {
        const cleanUrl = url.replace(/\/[^/]*$/, '');
        const ids = [...cleanUrl.matchAll(VIDEO_ID_REGEX)].map(match => match[1]);
        return ids.length > 0 ? (cleanUrl.includes('browse3') ? ids[0] : ids[ids.length - 1]) : null;
    }

    static async findLastPart(videoId, statusCallback) {
        let last = 0;
        let jump = true;

        document.getElementById('spinner').classList.remove('hidden');

        try {
            for (let i = 300; i <= MAX_PARTS; i++) {
                if (i === MAX_PARTS) throw new Error('Error getting video');
                if (i === 0) i = 1;

                const url = `${CLOUDFRONT_URL}/${videoId}/HIDDEN4500-${String(i).padStart(5, '0')}.ts`;

                try {
                    const resp = await fetch(url, { method: 'HEAD' });
                    if (resp.status === 403) {
                        if (i >= CHUNK_SIZE && i % CHUNK_SIZE === 0 && jump) {
                            last = i;
                            jump = true;
                            i -= (CHUNK_SIZE + 1);
                            continue;
                        }
                        break;
                    }
                    last = i;
                    jump = false;
                } catch (e) {
                    throw new Error('Failed to fetch video, make sure the URL is correct and you are connected to the internet');
                }
            }
        } finally {
            document.getElementById('spinner').classList.add('hidden');
        }

        return last;
    }

    static generateM3U8(videoId, lastPart) {
        let data = '#EXTM3U\n#EXT-X-PLAYLIST-TYPE:VOD\n#EXT-X-TARGETDURATION:10';
        for (let i = 1; i <= lastPart; i++) {
            data += `\n#EXTINF:10,\n${CLOUDFRONT_URL}/${videoId}/HIDDEN4500-${String(i).padStart(5, '0')}.ts`;
        }
        return data;
    }
}