const { Request, Response } = require("express");
const path = require("path");
const ytSearch = require("yt-search");
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Array of video's searched on yourtub
 */
module.exports = async (req, res) => {
    let query = req.query.query;
    if (!query)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    console.log(`[BULK SEARCH]: searched for ${query}`);
    let data = await ytSearch(query);
    const vids = data.videos.slice(0, 12);

    return res.send(vids);
};
