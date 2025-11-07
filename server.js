const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/universalapp', express.static(path.join(__dirname, 'public/universalapp')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || '99acres-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: false,
    httpOnly: true
  }
}));

app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const searchRoutes = require('./routes/search');
const agentRoutes = require('./routes/agents');
const emiCalculatorRoutes = require('./routes/emi-calculator');
const eligibilityCalculatorRoutes = require('./routes/eligibility-calculator');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/search', searchRoutes);
app.use('/agents', agentRoutes);
app.use('/home-loan-emi-calculator-hlpg', emiCalculatorRoutes);
app.use('/home-loan-eligibility-calculator-hlpg', eligibilityCalculatorRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 - Server Error',
    message: 'Something went wrong. Please try again later.'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

