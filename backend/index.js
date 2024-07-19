const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

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
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

// Obtain user by ID
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user === null) {
            res.status(404).json({ error: `No user found with ID ${id}.` });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
});

// Post new user
app.post('/api/users', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: role
        });
        res.json({ id: user.id });
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit user
app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    try {
        const [, affectedRows] = await User.update(
            user,
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
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.json('User deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/* RACES */
// Get races
app.get('/api/races', async (req, res) => {
    try {
        const races = await Race.findAll();
        res.json(races);
    } catch (error) {
        console.error("Error fetching races: ", error);
        res.status(500).json({ error: "Error fetching races" });
    }
});

// Obtain race by ID
app.get('/api/races/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const race = await Race.findByPk(id);
        if (race === null) {
            res.status(404).json({ error: `No race found with ID ${id}.` });
        } else {
            res.json(race);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the race.' });
    }
});

// Post new race
app.post('/api/races', async (req, res) => {
    try {
        const race = await Race.build(req.body)
        await race.validate()
        const validatedRace = await Race.create(req.body)
        res.json({ id: validatedRace.raceId })
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit race
app.patch('/api/races/:raceId', async (req, res) => {
    const { raceId } = req.params;
    const race = req.body;
    try {
        const [, affectedRows] = await Race.update(
            race,
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
app.delete('/api/races/:raceId', async (req, res) => {
    const { raceId } = req.params;
    try {
        const race = await Race.findOne({ where: { raceId } });
        if (!race) {
            return res.status(404).json({ error: 'Race not found' });
        }
        await race.destroy();
        res.json('Race deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/* COMMENTS */
// Get comments
app.get('/api/comments', async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments: ", error);
        res.status(500).json({ error: "Error fetching comments" });
    }
});

// Obtain comment by ID
app.get('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByPk(id);
        if (comment === null) {
            res.status(404).json({ error: `No comment found with ID ${id}.` });
        } else {
            res.json(comment);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the comment.' });
    }
});

// Post new comment
app.post('/api/comments', async (req, res) => {
    try {
        const comment = await Comment.build(req.body)
        await comment.validate()
        const validatedComment = await Comment.create(req.body)
        res.json({ id: validatedComment.id })
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit comment
app.patch('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    const comment = req.body;
    try {
        const [, affectedRows] = await Comment.update(
            comment,
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
app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findOne({ where: { id } });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        await comment.destroy();
        res.json('Comment deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/* REVIEWS */
// Get reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews: ", error);
        res.status(500).json({ error: "Error fetching reviews" });
    }
});

// Obtain review by ID
app.get('/api/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findByPk(id);
        if (review === null) {
            res.status(404).json({ error: `No review found with ID  ${id}.` });
        } else {
            res.json(review);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the review.' });
    }
});

// Post new review
app.post('/api/reviews', async (req, res) => {
    try {
        const review = await Review.build(req.body)
        await review.validate()
        const validatedReview = await Review.create(req.body)
        res.json({ id: validatedReview.id })
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
    }
});

// Edit review
app.patch('/api/reviews/:id', async (req, res) => {
    const { id } = req.params;
    const review = req.body;
    try {
        const [, affectedRows] = await Review.update(
            review,
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
app.delete('/api/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findOne({ where: { id } });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        await review.destroy();
        res.json('Review deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* Authentication */

// Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } }); // Search for an user with that email
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' }); // If the user doesn't exist, it returns a 401 error
        }
        // Bcrypt lets us compare the two by hashing the password we're reciving and comparing it to the hash we have in our table
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
        /* const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token }); */
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Signup
app.post('/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: 'user'
        });
        res.json({ id: user.id });
    } catch (error) {
        console.error(error);
        res.status(409).json({ error: error });
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
            { username: "user1", email: "user1@example.com", password: (await bcrypt.hash("password1", 10)).toString(), role: 'admin' },
            { username: "user2", email: "user2@example.com", password: (await bcrypt.hash("password2", 10)).toString(), role: 'user' },
            { username: "john_doe", email: "john.doe@example.com", password: (await bcrypt.hash("password123", 10)).toString(), role: 'user'},
            { username: "jane_smith", email: "jane.smith@example.com", password: (await bcrypt.hash("password456", 10)).toString(), role: 'user' },
            { username: "michael_jones", email: "michael.jones@example.com", password: (await bcrypt.hash("password789", 10)).toString(), role: 'user' },
            { username: "susan_lee", email: "susan.lee@example.com", password: (await bcrypt.hash("password321", 10)).toString(), role: 'user' },
            { username: "david_clark", email: "david.clark@example.com", password: (await bcrypt.hash("password654", 10)).toString(), role: 'user' }
        ];

        const races = [
            { raceName: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", date: new Date("2023-03-05"), time: "15:00:00" },
            { raceName: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche Circuit", date: new Date("2023-03-19"), time: "17:00:00" },
            { raceName: "Australian Grand Prix", circuit: "Albert Park Circuit", date: new Date("2023-04-02"), time: "04:00:00" },
            { raceName: "Chinese Grand Prix", circuit: "Shanghai International Circuit", date: new Date("2023-04-16"), time: "14:00:00" },
            { raceName: "Miami Grand Prix", circuit: "Miami International Autodrome", date: new Date("2023-05-07"), time: "15:30:00" },
            { raceName: "Monaco Grand Prix", circuit: "Circuit de Monaco", date: new Date("2023-05-28"), time: "15:00:00" },
            { raceName: "Spanish Grand Prix", circuit: "Circuit de Barcelona-Catalunya", date: new Date("2023-06-04"), time: "15:00:00" },
            { raceName: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", date: new Date("2023-06-18"), time: "20:00:00" },
            { raceName: "British Grand Prix", circuit: "Silverstone Circuit", date: new Date("2023-07-09"), time: "15:00:00" },
            { raceName: "Hungarian Grand Prix", circuit: "Hungaroring", date: new Date("2023-07-23"), time: "15:00:00" },
            { raceName: "Belgian Grand Prix", circuit: "Circuit de Spa-Francorchamps", date: new Date("2023-08-27"), time: "15:00:00" },
            { raceName: "Dutch Grand Prix", circuit: "Circuit Zandvoort", date: new Date("2023-09-03"), time: "15:00:00" },
            { raceName: "Italian Grand Prix", circuit: "Autodromo Nazionale Monza", date: new Date("2023-09-10"), time: "15:00:00" },
            { raceName: "Singapore Grand Prix", circuit: "Marina Bay Street Circuit", date: new Date("2023-09-17"), time: "20:00:00" },
            { raceName: "Japanese Grand Prix", circuit: "Suzuka Circuit", date: new Date("2023-09-24"), time: "06:00:00" },
            { raceName: "Qatar Grand Prix", circuit: "Losail International Circuit", date: new Date("2023-10-08"), time: "18:00:00" },
            { raceName: "United States Grand Prix", circuit: "Circuit of the Americas", date: new Date("2023-10-22"), time: "14:30:00" },
            { raceName: "Mexican Grand Prix", circuit: "Autódromo Hermanos Rodríguez", date: new Date("2023-10-29"), time: "14:00:00" },
            { raceName: "Brazilian Grand Prix", circuit: "Autódromo José Carlos Pace", date: new Date("2023-11-05"), time: "14:00:00" },
            { raceName: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", date: new Date("2023-11-26"), time: "17:00:00" },
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
            { userId: 1, raceId: 1, rating: 5, comment: "Fantastic race with an exciting finish!" },
            { userId: 2, raceId: 2, rating: 4, comment: "Great atmosphere, but the race was a bit dull." },
            { userId: 3, raceId: 3, rating: 3, comment: "Average race, nothing too special." },
            { userId: 4, raceId: 4, rating: 5, comment: "Incredible performance by the drivers!" },
            { userId: 5, raceId: 5, rating: 4, comment: "Nice race, but could use more overtaking." },
            { userId: 1, raceId: 6, rating: 5, comment: "Monaco never disappoints. Brilliant race!" },
            { userId: 2, raceId: 7, rating: 4, comment: "Good race with a few surprises." },
            { userId: 3, raceId: 8, rating: 3, comment: "The race was okay, but the weather conditions were challenging." },
            { userId: 4, raceId: 9, rating: 5, comment: "One of the best races of the season!" },
            { userId: 5, raceId: 10, rating: 4, comment: "A solid race, but the track is hard to pass on." },
            { userId: 1, raceId: 11, rating: 5, comment: "Spa is always a pleasure to watch. Great race!" },
            { userId: 2, raceId: 12, rating: 4, comment: "The Dutch Grand Prix was quite exciting." },
            { userId: 3, raceId: 13, rating: 3, comment: "The Italian Grand Prix was a bit underwhelming this year." },
            { userId: 4, raceId: 14, rating: 5, comment: "Singapore under the lights is always fantastic!" },
            { userId: 5, raceId: 15, rating: 4, comment: "A good race, but I expected more action." },
            { userId: 1, raceId: 16, rating: 5, comment: "Amazing race at Qatar, really enjoyed it." },
            { userId: 2, raceId: 17, rating: 4, comment: "The US Grand Prix was thrilling as always." },
            { userId: 3, raceId: 18, rating: 5, comment: "Mexico City delivered a fantastic race!" },
            { userId: 4, raceId: 19, rating: 4, comment: "Brazilian GP was entertaining but had some issues." },
            { userId: 5, raceId: 20, rating: 5, comment: "Great end to the season at Abu Dhabi!" }
        ];        

        const comments = [
            { reviewId: 1, userId: 2, comment: "I agree, it was a thrilling race!" },
            { reviewId: 2, userId: 3, comment: "I found it quite exciting, especially the second half." },
            { reviewId: 3, userId: 1, comment: "I think you might be a bit harsh, it was quite good." },
            { reviewId: 4, userId: 5, comment: "Definitely one of the highlights of the season!" },
            { reviewId: 5, userId: 4, comment: "I felt the same, more overtaking would have been great." },
            { reviewId: 6, userId: 3, comment: "Monaco's race was amazing, loved every minute!" },
            { reviewId: 7, userId: 1, comment: "Agreed, it was a good race but not the best." },
            { reviewId: 8, userId: 2, comment: "Weather made it hard to enjoy the race fully." },
            { reviewId: 9, userId: 5, comment: "Best race of the season, hands down." },
            { reviewId: 10, userId: 3, comment: "True, the track did make it difficult for overtaking." },
            { reviewId: 11, userId: 4, comment: "Spa is always a classic, great racing action!" },
            { reviewId: 12, userId: 2, comment: "Dutch GP had some great moments, enjoyed it." },
            { reviewId: 13, userId: 1, comment: "I was a bit disappointed, expected more excitement." },
            { reviewId: 14, userId: 5, comment: "Singapore under the lights is always spectacular." },
            { reviewId: 15, userId: 2, comment: "It was good but not as action-packed as I hoped." },
            { reviewId: 16, userId: 1, comment: "Qatar was amazing, great race overall." },
            { reviewId: 17, userId: 3, comment: "US GP is always fun, enjoyed it a lot." },
            { reviewId: 18, userId: 4, comment: "Mexico City provided an exciting race, well worth watching." },
            { reviewId: 19, userId: 2, comment: "Brazilian GP had some great moments but some issues too." },
            { reviewId: 20, userId: 1, comment: "A perfect ending to the season, loved it." }
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