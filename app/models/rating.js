var model = require('../models/index');

module.exports = function (sequelize, Sequelize) {

    var Rating = sequelize.define('rating', {

        bookId: {
            type: Sequelize.INTEGER,
            references: {
                model: model.book,
                key: 'id'
            },
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: model.user,
                key: 'id'
            },
            primaryKey: true
        },
        rating: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }

    });

    console.log(model.user);

    return Rating;

}