const express = require('express');
const db = require('../data/database');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { constrainedMemory } = require('process');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const personStatus = req.body.personStatus;

        let folder = 'images/';
        if (personStatus === 'foundPerson') {
            folder += 'found';
        } else if (personStatus === 'missingPerson') {
            folder += 'missing';
        } 

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);  
    },
    filename: function (req, file, cb) {
        // Use original file name or customize it if needed
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


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
    const { personStatus, fullname, age, gender, lastSeen, additionalDetails, email, contactNumber, permanentAddress } = req.body;
    const uploadedImageFile = req.file;  
    const uploadedImageFilePath = (uploadedImageFile.destination) + ('/') + (uploadedImageFile.filename);;

    // below is path of main.py
    exec(`D:\\SafeReturns\\.venv\\Scripts\\python.exe D:\\SafeReturns\\main.py ${uploadedImageFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${stderr}`);
            return res.status(500).send('Internal server error while processing the image.');
        }

        if (stdout.trim() === 'True') {
            // Save the report data to your database
            // const reportData = {
            //     personStatus,
            //     fullname,
            //     age,
            //     gender,
            //     lastSeen,
            //     additionalDetails,
            //     email,
            //     contactNumber,
            //     permanentAddress,
            //     imagePath: uploadedImageFile.path   // Save the image path in DB
            // };

            console.log('Report submitted');

            return res.send('Report submitted successfully!');
        } else {
            return res.status(400).send('Image does not meet the required criteria. Please upload a valid image.');
        }
    });
});



router.post('/logout', function (req, res) {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect('/');
});

module.exports = router;