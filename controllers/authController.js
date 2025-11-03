const { User } = require('../models');

exports.showLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Login - 99acres' });
};

exports.showSignup = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/signup', { title: 'Sign Up - 99acres' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, user_type } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash('error_msg', 'Email already registered. Please login.');
      return res.redirect('/auth/signup');
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      user_type: user_type || 'buyer'
    });

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      user_type: user.user_type
    };

    req.flash('success_msg', 'Account created successfully!');
    res.redirect('/');
  } catch (error) {
    console.error('Signup error:', error);
    req.flash('error_msg', 'Error creating account. Please try again.');
    res.redirect('/auth/signup');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('error_msg', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      user_type: user.user_type
    };

    req.flash('success_msg', 'Welcome back!');
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error_msg', 'Error logging in. Please try again.');
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
};

