const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/html/main.html");
});

app.get("/drum", function (req, res) {
    res.sendFile(__dirname + "/public/apps/drum/index.html");
});

app.get("/simon", function (req, res) {
    res.sendFile(__dirname + "/public/apps/simon/index.html");
});

app.get("/reaper", function (req, res) {
    res.sendFile(__dirname + "/public/apps/reaper/reaper_dungeon_bootVer.html");
});

app.get("/tindog", function (req, res) {
    res.sendFile(__dirname + "/public/apps/tindog/index.html");
});

app.get("/nuno", function (req, res) {
    res.sendFile(__dirname + "/public/apps/nuno/index.html");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});