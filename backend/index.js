const express = require("express");
const cors = require('cors');
const app = express();
const PORT = 3001;
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require("sequelize");

// Create sequelize instance
const sequelize = new Sequelize({
    storage: 'formula1debrief.db',
    dialect: 'sqlite',
    define: {
        defaultScope: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
    },
});

// Define models
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
});

const Race = sequelize.define('Race', {
    raceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    raceName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    circuit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
});

const Review = sequelize.define('Review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: true
});

const Comment = sequelize.define('Comment', {
    comment: {
        type: DataTypes.TEXT
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
});

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Race.hasMany(Review, { foreignKey: 'raceId' });
Review.belongsTo(Race, { foreignKey: 'raceId' });

Review.hasMany(Comment, { foreignKey: 'reviewId' });
Comment.belongsTo(Review, { foreignKey: 'reviewId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

app.use(cors());
app.use(bodyParser.json());

// sincronize database
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            popular();
            console.log('El servidor está corriendo en el puerto ' + PORT);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

/* USERS */
// Get users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

/* RACES */
// Get races
app.get('/races', async (req, res) => {
    try {
        const races = await Race.findAll();
        res.json(races);
    } catch (error) {
        console.error("Error fetching races: ", error);
        res.status(500).json({ error: "Error fetching races" });
    }
});

/* COMMENTS */
// Get comments
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments: ", error);
        res.status(500).json({ error: "Error fetching comments" });
    }
});

/* REVIEWS */
// Get reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews: ", error);
        res.status(500).json({ error: "Error fetching reviews" });
    }
});


/* DATABASE */
async function popular() {
    const userCount = await User.count();
    const raceCount = await Race.count();
    const reviewCount = await Review.count();
    const commentCount = await Comment.count();

    if (userCount === 0 && raceCount === 0 && reviewCount === 0 && commentCount === 0) {
        const users = [
            { username: "user1", email: "user1@example.com", password: "password1" },
            { username: "user2", email: "user2@example.com", password: "password2" }
        ];

        const races = [
            { raceId: 1, raceName: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", date: new Date("2024-03-03"), time: "15:00:00" },
            { raceId: 2, raceName: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche Circuit", date: new Date("2024-03-17"), time: "17:00:00" },
            { raceId: 3, raceName: 'Australian Grand Prix', circuit: 'Albert Park Circuit', date: new Date('2024-03-24'), time: '04:00:00' },
            { raceId: 4, raceName: 'Japanese Grand Prix', circuit: 'Suzuka Circuit', date: new Date('2024-04-07'), time: '06:00:00' },
            { raceId: 5, raceName: 'Chinese Grand Prix', circuit: 'Shanghai International Circuit', date: new Date('2024-04-21'), time: '14:00:00' },
            { raceId: 6, raceName: 'Miami Grand Prix', circuit: 'Miami International Autodrome', date: new Date('2024-05-05'), time: '15:30:00' },
            { raceId: 7, raceName: 'Emilia Romagna Grand Prix', circuit: 'Imola Circuit', date: new Date('2024-05-19'), time: '15:00:00' },
            { raceId: 8, raceName: 'Monaco Grand Prix', circuit: 'Circuit de Monaco', date: new Date('2024-05-26'), time: '15:00:00' },
            { raceId: 9, raceName: 'Canadian Grand Prix', circuit: 'Circuit Gilles Villeneuve', date: new Date('2024-06-09'), time: '14:00:00' },
            { raceId: 10, raceName: 'Austrian Grand Prix', circuit: 'Red Bull Ring', date: new Date('2024-06-23'), time: '15:00:00' },
            { raceId: 11, raceName: 'British Grand Prix', circuit: 'Silverstone Circuit', date: new Date('2024-07-07'), time: '15:00:00' }
        ];

        const reviews = [
            { userId: 1, raceId: 1, rating: 5, comment: "Great race!" },
            { userId: 2, raceId: 2, rating: 4, comment: "Exciting race!" }
        ];

        const comments = [
            { reviewId: 1, userId: 2, comment: "I agree, it was fantastic!" },
            { reviewId: 2, userId: 1, comment: "It was good, but could be better." }
        ];

        await User.bulkCreate(users, { validate: true });
        await Race.bulkCreate(races, { validate: true });
        await Review.bulkCreate(reviews, { validate: true });
        await Comment.bulkCreate(comments, { validate: true });

        console.log("Datos iniciales insertados");
    } else {
        console.log("La base de datos ya contiene datos");
    }
}


function mezclarArreglo(arreglo) {
    const mezclado = [...arreglo];
    const q = arreglo.length;
    for (let x = q * 2; x >= 0; x--) {
        const j = Math.floor(Math.random() * q);
        const i = Math.floor(Math.random() * q);
        [mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]];
    }
    return mezclado;
}