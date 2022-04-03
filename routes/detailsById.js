const { Request, Response } = require("express");
const path = require("path");
const ytSearch = require("yt-search");
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Sends Video details got by ytsearch 
 */
module.exports = async (req, res) => {
    let query = req.query.query;
    if (!query)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    console.log(`[GET DETAILS BY ID]: searched for ${query}`);
    let data = await ytSearch.search({
        videoId: query,
    });
    const vids = data;

    return res.send(vids);
};
