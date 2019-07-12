module.exports = function (sequelize, Sequelize) {

    var User = sequelize.define('user', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        firstName: {
            type: Sequelize.STRING(50),
            notEmpty: true
        },
        lastName: {
            type: Sequelize.STRING(50),
            notEmpty: true
        },
        username: {
            type: Sequelize.STRING(50),
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: '0'
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: '0'
        }

    });

    return User;

}