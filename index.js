const express = require('express');
const { sequelize } = require('./models');
const User = require('./models').User;
const bcrypt = require('bcrypt')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (req, res) => {
    res.end("Hello World!")
})

// Routes
app.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        console.log(user)
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json({ error: 'An error occurred while logging in', message: error.message });
    }
});

// Start server
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
