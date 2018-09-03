const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongo = require('mongoose');
const mongoose = require('mongoose');
mongoose.connect('mongodb://Ernest:dupadupa1@ds241012.mlab.com:41012/passport-login-registration-system', { useNewUrlParser: true });
const db = mongoose.connection.once('open', () => {
    console.log('connected to database');
});

const routes = require('./routes/index');
const users = require('./routes/users');

// Init App
const app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        const namespace = param.split('.');
        const root = namespace.shift();
        const formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

app.use(function(req, res, next) {
    res.locals.succes_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
    console.log('Server listening on port: ' + app.get('port'));
});



