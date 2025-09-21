// functions/api.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require("mongoose");
const User = require("../schema.js"); // Adjusted path
const session = require('express-session');
const bcrypt = require('bcryptjs'); 
const flash = require('connect-flash');
const serverless = require('serverless-http');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security and middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// Note: In a serverless setup, Netlify handles serving the 'public' directory directly.
// This line is useful for local development but may not be strictly necessary on Netlify.
app.use(express.static(path.join(__dirname, '../public')));


// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_secure_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// Connect-flash middleware
app.use(flash());

// Set EJS as templating engine
// The views directory is relative to the project root
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware to make session data available to all templates
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId; 
    res.locals.flashMessage = req.flash('error');
    next();
});

// Initialize Gemini API client
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is not set.');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error('MONGODB_URI is not set.');
}

// Establish connection once
mongoose.connect(mongoURI).then(() => {
    console.log("Connected to the database");
}).catch(err => console.error("Database connection error:", err));


// Define router
const router = express.Router();

// --- Convert all app.get/post to router.get/post ---

// Main routes
router.get('/', (req, res) => {
    res.render('index', {
        title: 'ALL IS WELL - Mental Wellness App',
        pageClass: 'homepage'
    });
});

router.get("/signup", (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render("signup.ejs", { title: 'Sign Up'});
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ error: "Email already registered." });
        
        const newUser = new User({ name, email, password });
        await newUser.save();
        req.session.userId = newUser._id;
        
        return res.redirect(`/`);
    } catch (err) {
        console.error("Registration error:", err);
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name });
        if (!user) {
            req.flash('error', 'Either name or password is incorrect.');
            return res.redirect('/login');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Either name or password is incorrect.');
            return res.redirect('/login');
        }
        req.session.userId = user._id;
        return res.redirect('/');
    } catch (err) {
        console.error("Login error:", err);
        req.flash('error', 'An unexpected error occurred. Please try again.');
        res.redirect('/login');
    }
});

router.get("/login", (req, res) => {
    if (req.session.userId) return res.redirect('/');
    res.render("login.ejs", { title: 'Login' });
});

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        req.flash('error', 'You must be logged in to access that feature.');
        return res.redirect('/login');
    }
    next();
};

router.get("/games", (req, res) => res.render("games.ejs"));
router.get("/piano", (req, res) => res.render("piano.ejs"));
router.get("/musicflower", (req, res) => res.render("musicflower.ejs"));
router.get("/bubblepop", (req, res) => res.render("bubblepop.ejs"));
router.get("/leafbasket", (req, res) => res.render("leafbasket.ejs"));

router.get('/assessment', requireLogin, (req, res) => res.redirect('/?openAssessment=true'));
router.get('/chat', requireLogin, (req, res) => res.redirect('/?openChat=true'));

router.post('/api/chat', requireLogin, async (req, res) => {
    // Chat logic from server.js
});

router.post('/api/assessment', requireLogin, async (req, res) => {
    // Assessment logic from server.js
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});

// Use the router
app.use('/.netlify/functions/api', router);

// Export the handler
module.exports.handler = serverless(app);
