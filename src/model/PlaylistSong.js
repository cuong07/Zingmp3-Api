const { DataTypes } = require('sequelize')
const db = require('../utils/database');


const PlaylistSong = db.define('PlaylistSong', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    songId: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = PlaylistSong;