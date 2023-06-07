const { DataTypes } = require('sequelize')
const db = require('../utils/database');


const Favourite = db.define('Favourite', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    songId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = Favourite;