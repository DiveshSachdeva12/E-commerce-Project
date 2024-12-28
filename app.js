const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/User');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const seedDB = require('./seed');
const cartRoutes = require('./routes/cart')

const app = express();

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/shopping-div-app')
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

// View Engine Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Setup
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session Configuration
const sessionConfig = {
    secret: 'thisShouldBeASecret', // Use a more secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly:true,
              expires:Date.now() + 24*7*60*60*1000,
              maxAge:24*7*60*60*1000
     } 
};
app.use(session(sessionConfig));
app.use(flash());


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and Current User Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use(productRoutes);  // Product Routes
app.use(reviewRoutes);    // Review Routes
app.use(authRoutes);      // Auth Routes
app.use(cartRoutes);      // cart Routes
// seedDB()

// Start Server
const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
