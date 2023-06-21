const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const exp = require('constants');
const db = require('better-sqlite3')('../db-login/users.db');
const app = express();
app.use(express.static('public'));
app.use('/images', express.static('images'));
// Set storage destination and filename for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const originalName = file.originalname;
      const ext = path.extname(originalName);
      const fileName = req.body['apikey'] + ext; // Change the file name as per your requirement
      cb(null, fileName);
    }
  });
const upload = multer({ storage });

function findUser(username, password) {
    return new Promise((resolve, reject) => {
      const row = db.prepare('SELECT * FROM USER WHERE user_name = ? AND password = ?').get(username, password);
      if (row){
        resolve(true);
      }
      else{
        resolve(false)
      }
    });
}

function insertUser(username, password) {
    return new Promise((resolve, reject) =>{
    const insert = db.prepare('INSERT INTO USER (user_name, password) VALUES (?, ?)');
    try{
    insert.run([username,password] );
    resolve(true);
    }
    catch(err){
      resolve(false)
    }
});
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'myappsecret',
  resave: true,
  saveUninitialized: true
}));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '\\public\\index.html');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  findUser(username, password).then(success => {
    if (success){
        req.session.user = username;
        res.redirect('/dashboard');
    }
    else{
        res.send('Invalid username or password');
    }
  }).catch(error => {
    
    console.error('Error:', error.message);
  });
  

});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    insertUser(username, password).then(success => {
    if (!success) {
        //alert("This user is exist! please choose another user name");
        //res.send("This user is exist! please choose another user name");
        res.status(400).send('This user already exists! Please choose another username.');
    }
    else{
        res.redirect('/');
    }
    })
  });

  app.get('/signup', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public\\signup.html'));
  
  });
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
   // res.send(`Welcome ${req.session.user}`);
   res.sendFile(path.join(__dirname, 'public\\dashboard.html'));
  }
});

app.post('/dashboard', upload.single('file'), (req, res) => {
    // Generate a random API key using SHA-256
    const apiKey = req.body['apikey'];
    const file_txt = req.file.path
    const fileData = fs.readFileSync(file_txt, 'utf-8');
    // Prepare the SQL statement
    const sql = db.prepare('UPDATE USER SET file_commands = ?, api_key = ? WHERE user_name=?');
    // Bind the file data to the SQL statement parameters
    sql.run([fileData, apiKey, req.session.user])
    // Close the database connection
    res.redirect('/succesful');
});

  

  app.get('/succesful', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public/succesful.html'));
  });

// Start server
app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});