module.exports = function (sequelize, DataTypes) {
    var Books = sequelize.define('books', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        author: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        publisher: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        thumbnail: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
            tableName: 'books'
        });

    return Books;
};