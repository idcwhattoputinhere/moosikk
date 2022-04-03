const { Request, Response } = require("express");
const ytdl = require("ytdl-core");
const path = require("path");
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns VIDEO stealer from youtube, help me get it fast ty
 */
module.exports = async (req, res) => {
    let songId = req.params.id;

    if (!songId)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));

    songId = songId.split(".mp4")[0];
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
        `[VIDEO FETCHER]: someone with vid id ${songId} got video ${vidInfo.videoDetails.title}`
    );
    let ytdlBase = ytdl(`https://www.youtube.com/watch?v=${songId}`, {
      format: "mp4",
      quality: 18
    });

    try {
        res.set("content-type", "video/mp4");
        //res.header("Content-Disposition", 'attachment; filename="Video.mp4');
        ytdlBase.pipe(res)
            // .on("data", (data) => {
            //     // console.log(`[VIDEO FETCHER]: data chunk received`);
            //     //res.write(data);
            //     //console.log(data)
            // })
            // .pipe(res);
        console.log(`[VIDEO FETCHER]: data sent`);
    } catch (err) {
        res.set("content-type", "text/html");
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    }
};
