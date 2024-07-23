const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // sequelize 설정 파일 경로

class PostModel extends Sequelize.Model {
    static init(sequelize){
        return super.init({

            id: {
                type: DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement:true
            },
            title: {
                type:DataTypes.STRING(20),
                allowNull:false
            },

            
            content: {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            createAt:{
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
                
            }
        }, {
            sequelize,
            timestamps: true,
            modelName: 'PostModel',
            tableName: 'postModel',
        });
    }
}

module.exports = PostModel;