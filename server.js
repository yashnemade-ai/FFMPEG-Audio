const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();

app.get('/stream', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL is required');

    res.setHeader('Content-Type', 'video/mp4');

    ffmpeg(url)
        .inputOptions([
            '-re', 
            '-user_agent', 'IPTVSmartersPlayer' // Ranapk bypass ke liye zaroori
        ])
        .videoCodec('copy') // Video copy (Fast load)
        .audioCodec('aac')  // Audio convert to AAC (Permanent Fix)
        .audioBitrate('128k')
        .format('mp4')
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .on('error', (err) => console.error('FFmpeg Error:', err))
        .pipe(res, { end: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Converter running on port ${PORT}`));
