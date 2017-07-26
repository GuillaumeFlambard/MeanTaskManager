const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
var tasks = require('./server/routes/tasks');
var users = require('./server/routes/users');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.urlencoded());
app.use(session({
    secret: 'keyboard cat'
    ,
    resave: true,
    saveUninitialized: true
    ,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', tasks);
app.use('/users/', users);


// Catch all other routes and return the index file
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4200';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('Test');
    io.emit("updateSocketList", 'boubou');
    io.emit("addUserToSocketList",'re');

    socket.on('hello_world', function(){
        console.log('coucou');
    });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function() {
    console.log("API running on localhost:" + port);
});