const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
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
        primaryKey: true,
        autoIncrement: true,
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
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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

// Relationships with CASCADE delete that automatically deletes all the data asociated
User.hasMany(Review, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Review.belongsTo(User, { foreignKey: 'userId' });

Race.hasMany(Review, {
    foreignKey: 'raceId',
    onDelete: 'CASCADE'
});
Review.belongsTo(Race, { foreignKey: 'raceId' });

Review.hasMany(Comment, {
    foreignKey: 'reviewId',
    onDelete: 'CASCADE'
});
Comment.belongsTo(Review, { foreignKey: 'reviewId' });

User.hasMany(Comment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Comment.belongsTo(User, { foreignKey: 'userId' });

// Configurations, like CORS usage and body parsing to json
app.use(cors());
app.use(bodyParser.json());

// Synchronize database
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            populateDatabase();
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
// Obtain all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

// Obtain user by ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const unUser = await User.findByPk(id);
        if (unUser === null) {
            res.status(404).json({ error: `No user found with ID ${id}.` });
        } else {
            res.json(unUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
});

// Post new user
app.post('/users', async (req, res) => {
    try {
        const unUser = await User.build(req.body)
        await unUser.validate()
        const validatedUser = await User.create(req.body)
        res.json({ id: validatedUser.id })
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit user
app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const unUser = req.body;
    try {
        const [, affectedRows] = await User.update(
            unUser,
            { where: { id } }
        );
        if (affectedRows === 0) {
            res.status(404).json({ error: `No user found with ID ${id}.` });
        } else {
            res.json({ id: id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const unUser = await User.findOne({ where: { id } });
        if (!unUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        await unUser.destroy();
        res.json('User deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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

// Obtain race by ID
app.get('/races/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const unRace = await Race.findByPk(id);
        if (unRace === null) {
            res.status(404).json({ error: `No race found with ID ${id}.` });
        } else {
            res.json(unRace);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the race.' });
    }
});

// Post new race
app.post('/races', async (req, res) => {
    try {
        const unRace = await Race.build(req.body)
        await unRace.validate()
        const validatedRace = await Race.create(req.body)
        res.json({ id: validatedRace.raceId })
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit race
app.patch('/races/:raceId', async (req, res) => {
    const { raceId } = req.params;
    const unRace = req.body;
    try {
        const [, affectedRows] = await Race.update(
            unRace,
            { where: { raceId } }
        );
        if (affectedRows === 0) {
            res.status(404).json({ error: `No race found with ID ${raceId}.` });
        } else {
            res.json({ id: raceId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the race.' });
    }
});

// Delete race
app.delete('/races/:raceId', async (req, res) => {
    const { raceId } = req.params;
    try {
        const unRace = await Race.findOne({ where: { raceId } });
        if (!unRace) {
            return res.status(404).json({ error: 'Race not found' });
        }
        await unRace.destroy();
        res.json('Race deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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

// Obtain comment by ID
app.get('/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const unComment = await Comment.findByPk(id);
        if (unComment === null) {
            res.status(404).json({ error: `No comment found with ID ${id}.` });
        } else {
            res.json(unComment);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the comment.' });
    }
});

// Post new comment
app.post('/comments', async (req, res) => {
    try {
        const unComment = await Comment.build(req.body)
        await unComment.validate()
        const validatedComment = await Comment.create(req.body)
        res.json({ id: validatedComment.id })
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit comment
app.patch('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const unComment = req.body;
    try {
        const [, affectedRows] = await Comment.update(
            unComment,
            { where: { id } }
        );
        if (affectedRows === 0) {
            res.status(404).json({ error: `No comment found with ID ${id}.` });
        } else {
            res.json({ id: id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the comment.' });
    }
});

// Delete comment
app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const unComment = await Comment.findOne({ where: { id } });
        if (!unComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        await unComment.destroy();
        res.json('Comment deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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

// Obtain review by ID
app.get('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const unReview = await Review.findByPk(id);
        if (unReview === null) {
            res.status(404).json({ error: `No review found with ID  ${id}.` });
        } else {
            res.json(unReview);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the review.' });
    }
});

// Post new review
app.post('/reviews', async (req, res) => {
    try {
        const unReview = await Review.build(req.body)
        await unReview.validate()
        const validatedReview = await Review.create(req.body)
        res.json({ id: validatedReview.id })
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit review
app.patch('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    const unReview = req.body;
    try {
        const [, affectedRows] = await Review.update(
            unReview,
            { where: { id } }
        );
        if (affectedRows === 0) {
            res.status(404).json({ error: `No review found with ID ${id}.` });
        } else {
            res.json({ id: id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the review.' });
    }
});

// Delete review
app.delete('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const unReview = await Review.findOne({ where: { id } });
        if (!unReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        await unReview.destroy();
        res.json('Review deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



/* DATABASE */
async function populateDatabase() {
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
            { raceName: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", date: new Date("2024-03-03"), time: "15:00:00" },
            { raceName: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche Circuit", date: new Date("2024-03-17"), time: "17:00:00" },
            { raceName: 'Australian Grand Prix', circuit: 'Albert Park Circuit', date: new Date('2024-03-24'), time: '04:00:00' },
            { raceName: 'Japanese Grand Prix', circuit: 'Suzuka Circuit', date: new Date('2024-04-07'), time: '06:00:00' },
            { raceName: 'Chinese Grand Prix', circuit: 'Shanghai International Circuit', date: new Date('2024-04-21'), time: '14:00:00' },
            { raceName: 'Miami Grand Prix', circuit: 'Miami International Autodrome', date: new Date('2024-05-05'), time: '15:30:00' },
            { raceName: 'Emilia Romagna Grand Prix', circuit: 'Imola Circuit', date: new Date('2024-05-19'), time: '15:00:00' },
            { raceName: 'Monaco Grand Prix', circuit: 'Circuit de Monaco', date: new Date('2024-05-26'), time: '15:00:00' },
            { raceName: 'Canadian Grand Prix', circuit: 'Circuit Gilles Villeneuve', date: new Date('2024-06-09'), time: '14:00:00' },
            { raceName: 'Austrian Grand Prix', circuit: 'Red Bull Ring', date: new Date('2024-06-23'), time: '15:00:00' },
            { raceName: 'British Grand Prix', circuit: 'Silverstone Circuit', date: new Date('2024-07-07'), time: '15:00:00' }
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

        console.log("Database populated successfully.");
    } else {
        console.log("Database is already full");
    }
}