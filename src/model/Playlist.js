const { DataTypes } = require('sequelize')
const db = require('../utils/database');


const Playlist = db.define('Playlist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
})

module.exports = Playlist;