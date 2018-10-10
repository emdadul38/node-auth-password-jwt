const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// create express app
const app = express();
const config = require('./config/database');
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Log requests to console
app.use(morgan('dev'));

// parse application/json
app.use(bodyParser.json());
app.use(cors());


mongoose.connect(config.db, {
	useNewUrlParser: true
});

mongoose.Promise = global.Promise;

require('./config/passport') (passport);

app.use(passport.initialize());
app.use(passport.session());
require('./routes/routes')(app, passport);

app.listen(port, function(){
	console.log('Server is running 3000');
})