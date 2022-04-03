const { Request, Response } = require("express");
const ytdl = require("ytdl-core");
const path = require("path");
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Audio stealer from youtube, help me get it fast ty
 */
module.exports = async (req, res) => {
    let songId = req.params.id;
  
    if (!songId)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));

    songId = songId.split(".mp3")[0];
    if (!songId)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    if (!/^[a-zA-Z0-9-_]{11}$/.test(songId))
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    let vidInfo = await ytdl.getInfo(
        `https://www.youtube.com/watch?v=${songId}`
    );
    if (!vidInfo.videoDetails.title)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    console.log(
        `[AUDIO FETCHER]: someone with vid id ${songId} got video ${vidInfo.videoDetails.title}`
    );
    let ytdlBase = ytdl(`https://www.youtube.com/watch?v=${songId}`, {
        filter: "audioonly",
        quality: "lowest",
    });

    try {
        res.set("content-type", "audio/mp3");

        ytdlBase
            .on("data", (data) => {
                // console.log(`[AUDIO FETCHER]: data chunk received`);
                // res.write(data);
            })
             .pipe(res);
        console.log(`[AUDIO FETCHER]: data sent`);
    } catch (err) {
        res.set("content-type", "text/html");
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    }
};
