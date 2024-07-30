const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const Academy = require('./Academy');

const Review = sequelize.define('Review', {
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    academyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Academy,
            key: 'id',
        }
    }
}, {
    timestamps: false,
});

Academy.hasMany(Review, { foreignKey: 'academyId', as: 'reviews' });
Review.belongsTo(Academy, { foreignKey: 'academyId', as: 'academy' });

module.exports = Review;
