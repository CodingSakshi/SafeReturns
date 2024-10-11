const express = require('express');
const db = require('../data/database');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');       // requiring multer
const upload = multer({});            // making object using it


router.get('/', function(req, res) {
    res.render('index'); 
});

router.get('/login', function(req, res) {
    res.render('login', { error: req.query.error }); 
});

router.get('/signup', function (req, res) {
    let sessionInputData = req.session.inputData;
    if(!sessionInputData) {
        sessionInputData = {
        usernameError: false,
        passwordError: false,
        username: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        userType: '',
        terms: ''
      };
    }
    req.session.inputData = null;
    res.render('signup', {inputData: sessionInputData});
});

router.get('/report', function(req, res) {
    if(!req.session.isAuthenticated) {          // if(!req.session.user)
        return res.status(401).render('401');
    }

    res.render('report'); 
});

router.get('/profile', function(req, res) {
    if(!req.session.isAuthenticated) {          // if(!req.session.user)
        return res.status(401).render('401');
    }
    
    res.render('profile'); 
});

router.get('/about', function(req, res) {
    res.render('about'); 
});

router.get('/technologies', function(req, res) {
    res.render('technologies'); 
});

router.get('/contact-us', function(req, res) {
    res.render('contact-us'); 
});

router.get('/terms-and-conditions', function(req, res) {
    res.render('terms-and-conditions'); 
});

router.get('/401', function(req, res) {
    res.render('401'); 
});

router.get('/404', function(req, res) {
    res.render('404'); 
});

router.get('/500', function(req, res) {
    res.render('500'); 
});



router.post('/signup', async function (req, res) {
    const { username, password, confirmPassword, fullname, userType, terms } = req.body;

    const existingUser = await db.getDb().collection('users').findOne({username: username});

    let usernameError = existingUser ? true : false;
    let passwordError = password !== confirmPassword;

    if (usernameError || passwordError) {
        req.session.inputData = {
            usernameError: usernameError,
            passwordError: passwordError,
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            fullname: fullname,
            userType: userType,
            terms: terms
        };

          req.session.save(function() {
            res.redirect('/signup');
          });
          return;
    };

    const hashedPassword = await bcrypt.hash(confirmPassword, 12);
    const user = {
        username: username,
        password: hashedPassword, 
        fullname: fullname,
        userType: userType
    };
    
    
    try {
        await db.getDb().collection('users').insertOne(user);
        res.redirect('/login');
    } 
    catch (err) {
        console.error(err);
        res.status(500).render('500');
    }

});

router.post('/login', async function(req, res) {
    const { username, password } = req.body;

    const existingUser = await db.getDb().collection('users').findOne({ username: username });
    if (!existingUser) {
        return res.render('login', { error: 'Incorrect username or password!' });
    }
  
    const isPasswordEqual = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordEqual) {
        return res.render('login', { error: 'Incorrect username or password!' });
    }

    req.session.user = {id: existingUser._id.toString(), username: existingUser.username};
    req.session.isAuthenticated = true;
    req.session.save(function() {
      res.redirect('/');
    })
});

router.post('/report', upload.single('image'), async function(req, res) {

    const { personStatus, fullname, age, gender, lastSeen, additionalDetails, image, email, contactNumber, permanentAddress } = req.body;
    const uploadedImageFile = req.file;


});

router.post('/logout', function (req, res) {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect('/');
});

module.exports = router;