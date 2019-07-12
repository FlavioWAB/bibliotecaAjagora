module.exports = function (sequelize, Sequelize) {

    var Book = sequelize.define('book', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING(50),
            primaryKey: true,
            notEmpty: true
        },
        author: {
            type: Sequelize.STRING(50),
            notEmpty: true
        },
        publisher: {
            type: Sequelize.STRING(50),
            notEmpty: true
        },
        description: {
            type: Sequelize.STRING(500),
            notEmpty: true
        },
        thumbnail: {
            type: Sequelize.STRING(50),
            notEmpty: true
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: '0'
        }

    });

    return Book;

}