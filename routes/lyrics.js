const { Request, Response } = require("express");
const fetch = require("node-fetch");
const htmlToText = require("html-to-text");
const encoding = require("encoding");
const divs1 =
    '</div></div></div></div><div class="hwc"><div class="BNeawe tAd8D AP7Wnd"><div><div class="BNeawe tAd8D AP7Wnd">';
const divs2 =
    '</div></div></div></div></div><div><span class="hwc"><div class="BNeawe uEec3 AP7Wnd">';
const url = "https://www.google.com/search?q=";
let noLyricsCache = [];
let cachedSongs = {};
setInterval(() => {
    noLyricsCache = [];
}, 600000); // 10 mins clear no lyrics cache
setInterval(() => {
    cachedSongs = {};
}, 600000); // 10 mins clear cached songs
const path = require("path");
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Probably the lyrics of the song searched
 */
module.exports = async (req, res) => {
    let songName = req.query.query;
    if (!songName)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "..", "/html", "/error.html"));
    songName = songName.trim();
    console.log(`[LYRICS API] Someone searched for: ${songName}`);
    if (noLyricsCache.includes(songName))
        return res.status(404).send({
            error: true,
            message: "No lyrics Found",
        });

    if (cachedSongs[songName])
        return res.send({
            error: false,
            message: cachedSongs[songName],
        });
    let lyrics = await search(songName);
    if (!lyrics) {
        noLyricsCache.push(songName);
        return res.status(404).send({
            error: true,
            message: "No lyrics Found",
        });
    }
    cachedSongs[songName] = lyrics;
    return res.send({
        error: false,
        message: lyrics,
    });
};
async function search(songName = "", songAuthor = "") {
    let data;
    try {
        data = await fetch(
            `${url}${encodeURIComponent(songAuthor + " " + songName)}+lyrics`
        );
        data = await data.textConverted();
        [, data] = data.split(divs1);
        [data] = data.split(divs2);
    } catch (m) {
        try {
            data = await fetch(
                `${url}${encodeURIComponent(
                    songAuthor + " " + songName
                )}+song+lyrics`
            );
            data = await data.textConverted();
            [, data] = data.split(divs1);
            [data] = data.split(divs2);
        } catch (n) {
            try {
                data = await fetch(
                    `${url}${encodeURIComponent(
                        songAuthor + " " + songName
                    )}+song`
                );
                data = await data.textConverted();
                [, data] = data.split(divs1);
                [data] = data.split(divs2);
            } catch (o) {
                try {
                    data = await fetch(
                        `${url}${encodeURIComponent(
                            songAuthor + " " + songName
                        )}`
                    );
                    data = await data.textConverted();
                    [, data] = data.split(divs1);
                    [data] = data.split(divs2);
                } catch (p) {
                    data = "";
                }
            }
        }
    }
    const ret = data.split("\n");
    let final = "";
    for (let j = 0; j < ret.length; j += 1) {
        final = `${final}${htmlToText.fromString(ret[j])}\n`;
    }
    return String(encoding.convert(final)).trim();
}
