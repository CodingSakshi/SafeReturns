const express = require('express');
const mongodb = require('mongodb') 
const ObjectId = mongodb.ObjectId;
const db = require('../data/database');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const { v4: uuidv4 } = require('uuid');
const { sourceMapsEnabled } = require('process');
const { match } = require('assert');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const personStatus = req.body.personStatus;

        let folder = 'images/';
        if (personStatus === 'Found Person') {
            console.log('Found folder')
            folder += 'found';
        } else if (personStatus === 'Missing Person') {
            console.log('Missing folder')
            folder += 'missing';
        } else {
            console.log('Temp folder');
            folder += 'temporary';
        }

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);  
    },
    filename: function (req, file, cb) {
        // Create a unique ID and use it for the filename
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, `${uniqueId}${ext}`); // Name the file with the unique ID and extension
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

router.get('/report-submitted', function(req, res) {
    if(!req.session.isAuthenticated) {          // if(!req.session.user)
        return res.status(401).render('401');
    }
    if (!req.session.reportSubmitted) {
        return res.redirect('/report');  
    }
    
    req.session.reportSubmitted = false;
    res.render('report-submitted'); 
});


router.get('/report-submitted-found', function(req, res) {
    if(!req.session.isAuthenticated) {          // if(!req.session.user)
        return res.status(401).render('401');
    }
    if (!req.session.reportSubmitted) {
        return res.redirect('/report');  
    }
    
    req.session.reportSubmitted = false;
    res.render('report-submitted-found'); 
});


router.get('/account/:username', async function(req, res) {  // Dynamically captures username from URL
    if (!req.session.isAuthenticated) {  // Check if the user is authenticated
        return res.status(401).render('401');
    }

    // Check if the username in the URL matches the session user
    if (req.params.username !== req.session.user.username) {
        return res.status(403).render('403'); // Forbidden if trying to access another user's profile
    }

    try {
        // Fetch the user document and include the necessary fields
        const user = await db.getDb().collection('users').findOne(
            { _id: new ObjectId(req.session.user.id) },
            { projection: { username: 1, fullname: 1, userType: 1, reports: 1 } }  // Include necessary fields
        );
    
        // Check if user was found
        if (!user) {
            return res.status(404).render('404'); // Handle user not found
        }
        
        const reports = await db.getDb().collection('reports').find({
            _id: { $in: user.reports }  
        }).toArray();
    
        // Render the 'account' page, passing the user's reports to the template
        res.render('account', { user: user, reports: reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).render('500'); // Render error page in case of issues
    }
});


router.get('/account/report/:id', async function(req, res, next) {
    if (!req.session.isAuthenticated) {  
        return res.status(401).render('401');
    }

    try {
        const report = await db.getDb().collection('reports').findOne({ _id: req.params.id });
        if (!report) {
            return res.status(404).render('404');
        }
        
        res.render('report-detail', {report: report});
        
    }
    catch {
        console.error('Error fetching reports:', error);
        res.status(500).render('500');
    }

});


router.get('/about', function(req, res) {
    res.render('about'); 
});

router.get('/technologies', function(req, res) {
    res.render('technologies'); 
});

router.get('/contact', function(req, res) {
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
        username: username.toLowerCase(),
        password: hashedPassword, 
        fullname: fullname,
        userType: userType,
        reports: [],
        userSince: new Date()
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
    let { username, password } = req.body;
    username = username.toLowerCase();

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
    let isMatched = false;
    let { matchedWith } = req.body;
    const { personStatus, fullname, age, gender, additionalDetails, email, contactNumber, permanentAddress } = req.body;
    const uploadedImageFile = req.file;

    // Check if image file is uploaded
    // if (!uploadedImageFile) {
    //     return res.status(400).send('Image file is required.');
    // }

    const uploadedImageFilePath = ('/') + (uploadedImageFile.destination) + ('/') + (uploadedImageFile.filename);
    // Create a new unique ID for the report
    const uniqueId = path.basename(uploadedImageFile.filename, path.extname(uploadedImageFile.filename));

    if (matchedWith !== '') {
        const matchedUser = await db.getDb().collection('reports').findOne({ _id: matchedWith });
        console.log(matchedUser); // Log the matched user document
    
        // Now you can update the email
        // const newEmail = 'newemail@example.com'; // Replace with the new email you want to set
        const result = await db.getDb().collection('reports').updateOne(
            { _id: matchedWith }, // Query to find the document to update
            { $set: { matchedWith: uniqueId } } // The update operation to set the new email
        );
    
        if (result.modifiedCount > 0) {
            console.log('Email updated successfully');
            isMatched = true;
        } else {
            console.log('No documents were updated');
            isMatched = false;
        }
    }


    


    // Save the report data to your database with the unique ID as the _id
    const reportData = {
        _id: uniqueId,  // Set a unique ID (ensure it's actually unique)
        personStatus,
        fullname,
        age,
        gender,
        // lastSeen,
        additionalDetails,
        email,
        contactNumber,
        permanentAddress,
        imagePath: uploadedImageFilePath,
        matchedWith: matchedWith,
        reportedAt: new Date()
    };


    try {
        // Insert report data into the database
        await db.getDb().collection('reports').insertOne(reportData);

        // Update the user document to add the report ID to the user's reports array
        const userUpdateResult = await db.getDb()
            .collection('users') // Access the users collection
            .updateOne(
                { _id: new ObjectId(req.session.user.id) }, // Find the user by ID
                {
                    $push: { reports: uniqueId } // Add the new report ID to the user's reports array
                }
            );

        // Check if user was updated successfully
        if (userUpdateResult.modifiedCount === 0) {
            // Rollback by deleting the report if user update failed
            await db.getDb().collection('reports').deleteOne({ _id: uniqueId });
            return res.status(500).send('User update failed. Report deleted.');
        }

        req.session.reportSubmitted = true; // Mark report as submitted
        console.log('Report submitted');
        if(isMatched == true) {
            return res.redirect('/report-submitted-found');
        }
        return res.redirect('/report-submitted');
    } catch (err) {
        console.error(err);
        // Handle error: delete the report if insertion fails
        await db.getDb().collection('reports').deleteOne({ _id: uniqueId });
        res.status(500).render('500');
    }
});




router.post('/verify-image', upload.single('image'), function(req, res) {
    const uploadedImageFile = req.file;
    const personStatus = req.body.personStatus;
    console.log(personStatus)

    const uploadedImageFilePath = (uploadedImageFile.destination) + ('/') + (uploadedImageFile.filename);
    
    
    // Defining the arguments to pass to the Python script
    const arg1 = uploadedImageFilePath;
    const arg2 = personStatus;

    // Spawn the Python process
    const pythonProcess = spawn('python', ['main.py', arg1, arg2]);

    // Variables to hold the output from Python
    let fullOutput = '';  // Store full output as a string

    // Handle output from the Python script
    pythonProcess.stdout.on('data', (data) => {
        // Collect full output data (could arrive in chunks)
        fullOutput += data.toString();
    });

    // Handle errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });


    // Handle when the Python process exits
    pythonProcess.on('exit', (code) => {
        console.log(`Python process exited with code ${code}`);
        
        // Split the full output by new lines
        const outputLines = fullOutput.trim().split('\n');
    
        // Assign output lines to x and y, if available
        if (outputLines.length >= 2) {
            const detect_face = outputLines[0]; // First line of output
            const match_face = outputLines[1]; // Second line of output
            console.log(`Detect Face: ${detect_face}`);
            console.log(`Match Face: ${match_face}`);
            return res.json({ detect_face, match_face });
        } else {
            console.error('Not enough output from Python script.');
            return res.status(500).json({ message: 'Error processing the image.' });
        }
    });

    // Ensure the image is deleted after processing
    pythonProcess.on('exit', (code) => {
        // Delete the uploaded image file regardless of the Python script success
        fs.unlink(uploadedImageFilePath, (err) => {
            if (err) {
                console.error(`Error deleting the image: ${err}`);
            } else {
                console.log('Uploaded image deleted successfully.');
            }
        });
    });
});


router.post('/logout', function (req, res) {
    req.session.user = null;
    req.session.isAuthenticated = false;
    res.redirect('/');
});

module.exports = router;