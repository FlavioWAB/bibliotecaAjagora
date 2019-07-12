module.exports = function (sequelize, DataTypes) {
    var Ratings = sequelize.define('ratings', {
        bookId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'books',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        rating: {
            type: DataTypes.INTEGER(4),
            allowNull: false
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
            tableName: 'ratings'
        });

    Ratings.associate = (models) => {

        models.ratings.belongsTo(models.books, {foreignKey: 'bookId'});
        models.ratings.belongsTo(models.users, {foreignKey: 'userId'});

        models.books.hasMany(models.ratings);
        models.users.hasMany(models.ratings);

    };

    return Ratings;
};
