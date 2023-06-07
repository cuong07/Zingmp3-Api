const path = require('path')
const express = require("express")
require('dotenv').config()
const app = express()
const cors = require("cors")
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");


const db = require('./src/utils/database')

// model 
const User = require('./src/model/User')
const Favourite = require('./src/model/Favourite')
const Playlist = require('./src/model/Playlist')
const PlaylistSong = require('./src/model/PlaylistSong')

// ZingMp3Router
const ZingMp3Router = require("./src/routes/ZingRouter")
const UserRouter = require("./src/routes/User")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);


// Page Home
app.get("/", (req, res) => {
    res.send('SERVER ON')
})

// Trong model User
User.hasMany(Favourite);
// Trong model Favorite
Favourite.belongsTo(User);
// Trong model User
User.hasMany(Playlist);
// Trong model Playlist
Playlist.belongsTo(User);
// Trong model Playlist
Playlist.belongsToMany(PlaylistSong, { through: 'PlaylistPlaylistSong' });
PlaylistSong.belongsTo(Playlist);


app.use("/api", ZingMp3Router)
app.use("/api", UserRouter)

// Page Error
app.get("*", (req, res) => {
    res.send("Nhập Sai Đường Dẫn! Vui Lòng Nhập Lại >.<")
});
// { force: true }
db.sync()
    .then((response) => {
        app.listen(port, () => {
            console.log(`Start server listen at http://localhost:${port}`)
        });
    })
    .catch((err) => {
        console.log(err);
    })


