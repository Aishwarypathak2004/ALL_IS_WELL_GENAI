// index.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require("mongoose");
const User = require("./schema.js");
const session = require('express-session');
const bcrypt = require('bcryptjs'); 
const flash = require('connect-flash');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security and middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_secure_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 *7
    }
}));

// Connect-flash middleware
app.use(flash());

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to make session data available to all templates
app.use((req, res, next) => {
    // Determine if the user is logged in by checking the session
    res.locals.isLoggedIn = !!req.session.userId; 
    res.locals.flashMessage = req.flash('error');
    next();
});

// Initialize Gemini API client
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Use the recommended model name for chat
const chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error('MONGODB_URI is not set in environment variables.');
    process.exit(1);
}

main().then(() => {
    console.log("Connected to the database");
}).catch(err => console.error("Database connection error:", err));

async function main() {
    await mongoose.connect(mongoURI);
}

// Main routes
app.get('/', (req, res) => {
    try {
        res.render('index', {
            title: 'ALL IS WELL - Mental Wellness App',
            pageClass: 'homepage'
        });
    } catch (error) {
        console.error('Error rendering homepage:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/signup", (req, res) => {
    // Redirect if user is already logged in
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render("signup.ejs", { title: 'Sign Up'});
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered." });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        req.session.userId = newUser._id;
        
        return res.redirect(`/`);
    } catch (err) {
        console.error("Registration error:", err);
        res.status(400).json({ error: err.message });
    }
});

// New login route
app.post('/login', async (req, res) => {
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

app.get("/login", (req, res) => {
    // Redirect if user is already logged in
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render("login.ejs", { title: 'Login' });
});

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        req.flash('error', 'You must be logged in to access that feature.');
         res.redirect('/login');
         

    }
    next();
};
app.get("/games",(req,res)=>{res.render("games.ejs")})
app.get("/piano",(req,res)=>{res.render("piano.ejs")})
app.get("/musicflower",(req,res)=>{res.render("musicflower.ejs")})
app.get("/bubblepop",(req,res)=>{res.render("bubblepop.ejs")})
app.get("/leafbasket",(req,res)=>{res.render("leafbasket.ejs")})
app.get('/assessment', requireLogin, (req, res) => {
    try {
        res.redirect('/?openAssessment=true');
    } catch (error) {
        console.error('Error accessing assessment:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/chat', requireLogin, (req, res) => {
    try {
        res.redirect('/?openChat=true');
    } catch (error) {
        console.error('Error accessing chat:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Corrected API endpoint for chat
app.post('/api/chat', requireLogin, async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        const chat = chatModel.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }],
            })),
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const result = await chat.sendMessage(message);
        const aiMessage = result.response.text();

        return res.json({
            success: true,
            message: aiMessage,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Unable to process chat message',
        });
    }
});

// API endpoint for assessment
app.post('/api/assessment', requireLogin, async (req, res) => {
    try {
        const { responses, score, category, timestamp } = req.body;

        if (!responses || typeof score !== 'number') {
            return res.status(400).json({
                success: false,
                error: 'Invalid assessment data'
            });
        }

        console.log('Assessment saved:', { score, category, timestamp });

        res.json({
            success: true,
            message: 'Assessment saved successfully',
            resources: getResourcesForScore(score)
        });
    } catch (error) {
        console.error('Assessment API error:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to save assessment'
        });
    }
});

// Helper function to provide resources based on assessment score
function getResourcesForScore(score) {
    if (score <= 7) {
        return {
            category: 'well',
            suggestions: ['Continue daily self-care practices', 'Maintain regular sleep schedule', 'Keep connecting with supportive people']
        };
    } else if (score <= 15) {
        return {
            category: 'mild',
            suggestions: ['Practice deep breathing exercises', 'Consider guided meditation', 'Reach out to trusted friends or family']
        };
    } else if (score <= 23) {
        return {
            category: 'moderate',
            suggestions: ['Consider speaking with a counselor', 'Practice stress-reduction techniques', 'Maintain regular check-ins with support network']
        };
    } else {
        return {
            category: 'high',
            suggestions: ['Strongly consider professional support', 'Contact mental health resources', 'Reach out to crisis support if needed']
        };
    }
}

// New Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).render('error', {
        title: 'Error - ALL IS WELL',
        error: process.env.NODE_ENV === 'development' ? err : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - ALL IS WELL',
        message: 'Page not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`ALL IS WELL server running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});