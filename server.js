// 1. Import Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config(); // This line loads the .env file

// 2. Create an Express application
const app = express();
const PORT = 3000;

// 3. Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI) // Uses the variable from your .env file
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch(error => console.error('Error connecting to MongoDB Atlas:', error));

// 5. Serve static files
app.use(express.static(path.join(__dirname)));

// 6. Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// 7. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});