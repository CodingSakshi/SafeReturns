const express = require('express');
const path = require('path');
const app = express();
const demoRoutes = require('./routes/routes');
const db = require('./data/database')
const session = require('express-session');

// -----for handling session-----
const mongodbStore = require('connect-mongodb-session');
const MongoDBStore = mongodbStore(session);
const sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017',
  databaseName: 'auth-demo',
  collection: 'sessions'
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));             // To parse form data

// Session middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "super-secret",
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use(function(req, res, next) {                                       // custom middleware that sets a local variable (isAuthenticated) for all templates rendered during the request/response cycle
  res.locals.isAuthenticated = req.session.isAuthenticated || false;     
  next();
});



// Routes
app.use(demoRoutes);

// connect with db
db.connectWithDatabase().then(function() { 
    app.listen(3000, function() {
      console.log('Server is running on port 3000');
    });
  }).catch(function(err) {
    console.error('Failed to connect to the database:', err);
  });
