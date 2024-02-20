const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const PORT = process.env.PORT * 1 || 5000;
require('./auth');

const app = express();

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		// cookie: { secure: true },
	})
);
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
	req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
	res.send('<a href="/auth/google" >Authenticate with Google</a>');
});

app.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['email', 'profile'] }),
	(req, res) => {
		res.send('done');
	}
);

app.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/protected',
		failureRedirect: '/auth/failure',
	})
);

app.get('/auth/failure', (req, res) => {
	res.send('Something went wrong');
});

app.get('/protected', isLoggedIn, (req, res) => {
	// let name = req.user.displayName;
	console.log(req.user);
	// console.log(name);
	res.send('Hello From Protected!' + req.user.displayName);
});

app.listen(PORT, console.log('Running at PORT', PORT));
