const express = require("express");
const app = express();
const path = require("path");
const body_parser = require("body-parser");
app.use(require("cors")());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.get("/api/audio/:id", require("./routes/audio.js"));
app.get("/api/video/:id", require("./routes/video.js"));
app.get("/api/search", require("./routes/search.js"));
app.get("/api/lyrics", require("./routes/lyrics.js"));
app.get("/api/detailsById", require("./routes/detailsById.js"));
app.get("/404", (req, res) =>
    res.sendFile(path.join(__dirname, "/html", "/error.html"))
);
app.get("/favicon.ico", (req, res) =>
    res.sendFile(path.join(__dirname, "/html", "/favicon.ico"))
);
app.get("/*", (req, res) => {
    console.log("[MAIN]: Someone opened the page");
    res.sendFile(path.join(__dirname, "/html", "/player.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log("app running on http://localhost:3000");
});

// __   _______ ____  _       ____  _____    _    ____  
// \ \ / /_   _|  _ \| |     |  _ \| ____|  / \  |  _ \ 
//  \ V /  | | | | | | |     | | | |  _|   / _ \ | | | |
//   | |   | | | |_| | |___  | |_| | |___ / ___ \| |_| |
//   |_|   |_| |____/|_____| |____/|_____/_/   \_\____/ 

