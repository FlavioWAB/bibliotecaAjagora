module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        admin: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        deleted: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
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
            tableName: 'users'
        });
};
