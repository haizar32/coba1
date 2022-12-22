const express = require('express');

const mysql = require('mysql');
const session = require('express-session');
const { response } = require('express');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'login'
});

const app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function(request, response) {
	// Render login template
	response.render('login');
});

//log out
app.get('/button',(req,res)=> {
	req.session.destroy();
	res.redirect('/login');
  })

app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/dashboard-mahasiswa');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/dashboard-mahasiswa', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.render('dashboard-mahasiswa');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});
// app.get("/", function(req, res){
//     res.render('dashboard-mahasiswa')
// })

// app.get("/jadwal-mahasiswa", function(req, res){
//     res.render('jadwal-mahasiswa')
// })
app.get('/', function(req, res){
    res.render('login')
})

 app.get('/nilai-matkul-mahasiswa', function(req, res){
    res.render('nilai-matkul-mahasiswa')
})

 app.get('/profile-mahasiswa', function(request, response){
    response.render('profile-mahasiswa')
 })

 app.get('/matkul-mahasiswa', function(req, res){
    res.render('matkul-mahasiswa')
})

// app.get("/nilai-matkul-mahasiswa", function(req, res){
//     res.render('nilai-matkul-mahasiswa')
// })

// app.get("/dashboard-dosen", function(req, res){
//     res.render('dashboard-dosen')
// })

// app.get("/jadwal-dosen", function(req, res){
//     res.render('jadwal-dosen')
// })

// app.get("/matkul-dosen", function(req, res){
//     res.render('matkul-dosen')
// })

 app.get('/profile-dosen', function(req, res){
     res.render('profile-dosen')
})
app.get('/jadwal-mahasiswa', function(request, response) {
	// Render login template
	response.render('jadwal-mahasiswa');	
});

app.use(express.static('public'))

app.listen(8080, function () {
    console.log('Server berjalan diport 6000');
})