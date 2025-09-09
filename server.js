// 1. Import Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

// 2. Create an Express application
const app = express();
const PORT = 3000;

// 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch(error => console.error('Error connecting to MongoDB Atlas:', error));

// 5. Session Configuration (NEW)
app.use(session({
    secret: 'a_very_long_random_secret_key_for_security', // Replace with a long, random string
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Cookie expires after 1 day (in milliseconds)
    }
}));

// 6. Serve static files
app.use(express.static(path.join(__dirname)));

// 7. API Routes
// ==========================================================

// SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }
        const newUser = new User({ fullName: fullname, email, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error during account creation." });
    }
});

// LOGIN ROUTE (Updated with Session Logic)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }

        // *** NEW: Create a session for the user ***
        req.session.userId = user._id; // Store the user's unique ID in the session

        res.status(200).json({ message: "Login successful!", user: { name: user.fullName } });
    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
});

// *** NEW: Endpoint to get the currently logged-in user's data ***
app.get('/api/current-user', async (req, res) => {
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password'); // Find user but exclude password
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// ==========================================================

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// 8. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});