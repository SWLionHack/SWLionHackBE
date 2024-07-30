const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const Academy = sequelize.define('Academy', {
    academyname: {  
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
});

module.exports = Academy;
