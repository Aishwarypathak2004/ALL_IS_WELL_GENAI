# ALL_IS_WELL_GENAI
ALL IS WELL - Mental Wellness Web Application ALL IS WELL is a Node.js web application designed to be a gentle, supportive space for mental wellness. It provides users with a collection of tools for stress relief, self-reflection, and finding peace, including interactive games, a supportive AI chatbot, and a self-assessment module.


Team Perceptron - ALL IS WELL - Mental Wellness Web Application
ALL IS WELL is a Node.js web application designed to be a gentle, supportive space for mental wellness. It provides users with a collection of tools for stress relief, self-reflection, and finding peace, including interactive games, a supportive AI chatbot, and a self-assessment module.
Table of Contents
About The Project
Core Features
Technology Stack
Getting Started
Prerequisites
Installation & Setup
Project Structure
Routes and API Endpoints
Environment Variables
Contributing
License
About The Project
The primary goal of ALL IS WELL is to offer a non-clinical, accessible platform where users can engage in calming activities to manage stress and check in with their emotional state. The application is built with a user-centric approach, featuring secure authentication and session management to protect user interactions with sensitive features like the self-assessment and the AI chat.
Core Features
Secure User Authentication: Users can sign up, log in, and log out. Passwords are securely hashed using bcryptjs, and sessions are managed with express-session.
Protected Features: Key features like the Wellness Assessment and the Supportive Chat are accessible only to logged-in users, ensuring privacy.
Supportive AI Chatbot: Integrated with the Google Gemini API, the chatbot provides a safe space for users to share their thoughts and receive gentle, supportive responses.
Wellness Self-Assessment: A private tool for users to reflect on their current emotional state. The results provide non-diagnostic feedback and gentle suggestions.
Stress-Relief Games: A dedicated section with simple, calming web-based games designed for relaxation, including:
Piano
Bubble Pop
Music Flower
Leaf Basket
Flash Messaging: The application uses connect-flash to provide contextual feedback to users, such as login errors or reminders to log in before accessing certain features.
Technology Stack
The project is built with the following technologies:
Category
Technology
Backend
Node.js, Express.js
Database
MongoDB with Mongoose ODM
Frontend
EJS (Embedded JavaScript templates) for server-side rendering
Auth & Session
express-session, bcryptjs, connect-flash
External API
Google Generative AI (Gemini)

Getting Started
Follow these instructions to get a local copy of the project up and running.
Prerequisites
Make sure you have the following installed on your local machine:
Node.js (version 14.0.0 or higher)
npm (comes with Node.js)
MongoDB (ensure the server is running)
Installation & Setup
Clone the repository:
git clone <your-repository-url>
cd team-perceptron/project


Install NPM packages:
npm install


Create an Environment File:
Create a .env file in the project directory and add the necessary environment variables.
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
MONGODB_URI=mongodb://127.0.0.1:27017/log
SESSION_SECRET=a_very_secure_secret_key_change_me


Replace YOUR_GEMINI_API_KEY with your actual key from Google AI Studio.
The MONGODB_URI points to a local MongoDB database named log.
SESSION_SECRET is a secret key used to sign the session ID cookie. It is highly recommended to change this to a long, random string.
Run the application:
npm start

The server will start on http://localhost:3000.
Project Structure
The project follows a standard Node.js/Express application structure:
team-perceptron/
└── project/
    ├── public/               # Static assets (CSS, client-side JS, images)
    ├── views/                # EJS template files (.ejs)
    │   ├── index.ejs
    │   ├── login.ejs
    │   ├── signup.ejs
    │   ├── games.ejs
    │   └── ... (other game views)
    ├── .env                  # Environment variables (must be created locally)
    ├── package.json          # Project metadata and dependencies
    ├── server.js             # Main Express server configuration and routes
    └── schema.js             # Mongoose User schema definition


Routes and API Endpoints
Page Routes
Method
Path
Description
GET
/
Renders the main homepage.
GET
/signup
Renders the user registration page.
POST
/register
Handles new user registration.
GET
/login
Renders the user login page.
POST
/login
Handles user login.
GET
/logout
Logs the user out and destroys the session.
GET
/games
Renders the main games page.
GET
/piano
Renders the Piano game page.
GET
/musicflower
Renders the Music Flower game page.
GET
/bubblepop
Renders the Bubble Pop game page.
GET
/leafbasket
Renders the Leaf Basket game page.
GET
/assessment
Protected. Redirects to the homepage to open the assessment modal.
GET
/chat
Protected. Redirects to the homepage to open the chat panel.

API Routes
Method
Path
Description
POST
/api/chat
Protected. Handles chat messages via Gemini API.
POST
/api/assessment
Protected. Saves user assessment data to the server.

Environment Variables
These variables are required to run the application and should be defined in your .env file.
Variable
Description
Example
GEMINI_API_KEY
Your API key for the Google Generative AI service.
AIzaSy...
MONGODB_URI
The connection string for your MongoDB database.
mongodb://127.0.0.1:27017/log
SESSION_SECRET
A random, secret string used for signing session cookies.
a_very_secure_secret_key_change_me

Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
Please see CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.
License
This project is distributed under the MIT License. See LICENSE for more information.
