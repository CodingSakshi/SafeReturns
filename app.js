const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));             // To parse form data


// Routes
app.get('/', function(req, res) {
    res.render('index'); 
});

app.get('/login', function(req, res) {
    res.render('login'); 
});

app.get('/signup', function(req, res) {
    res.render('signup'); 
});

app.get('/terms-and-conditions', function(req, res) {
    res.render('terms-and-conditions'); 
});

// Start the server
app.listen(3000, () => {
    console.log('Listening at port 3000');
});
