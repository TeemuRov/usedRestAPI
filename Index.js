const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportHttp = require('passport-http');
const cors = require('cors');
const app = express()
const fs = require('fs');
const multer  = require('multer')
const multerUpload = multer({ dest: 'uploads/' })
const port = 4000


app.use(bodyParser.json());
app.use(cors());



let users = [
  {
    id: '70c618cb-a9a8-43f3-b692-3878a9ec44e1',
    username: 'Teemu',
    password: '$2a$08$YIj.vn8QVGYWtOzp.u7acOZgHYM4cVRH13Ws5kbQT4RxKOLbmX4ta', // 123456
    email: "test@test.com"
  }
];



let items = [
  {
    id: uuidv4(),
    title: "a",
    description: "a",
    category: "a",
    location : "a",
    postingDate : "2016-08-29T09:12:33.001Z",
    deliveryType : "",
    SellerInfo : "joe doe 0334232032",
    releaseDate : "2016-08-29T09:12:33.001Z"
  }

];

passport.use(new passportHttp.BasicStrategy(function(username, password, done) {
  const userResult = users.find(user => user.username === username);
  if(userResult == undefined) {
    return done(null, false);
  }

  if(bcrypt.compareSync(password, userResult.password) == false)
  {
    return done(null, false);
  }

  done(null, userResult);

}));


app.get('/', (req, res) => {
  res.send('Welcome')
});


app.post('/register', (req, res) =>{
  console.log(req.body);
  const passwordHash = bcrypt.hashSync(req.body.password, 8);

  users.push({
    id: uuidv4(),
    username: req.body.username,
    password: passwordHash,
    email: req.body.email
  });
  res.sendStatus(200);
});

app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {
  res.sendStatus(200);
});

app.post('/createitem', passport.authenticate('basic', {session: false}), (req, res) =>{
  const newItem = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: req.body.location,
    price: req.body.price,
    postingDate: req.body.postingDate,
    deliveryType: req.body.deliveryType
  };
  items.push(newItem);
  console.log(req.headers);
  res.sendStatus(200);
})
app.put('/edititem/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  const result = users.find(t => t.id == req.params.id);
  if (result != undefined)
  {
    for (const key in req.body) {
      result[key] = req.body[key]
    }
    res.sendStatus(200)
  }
  else{
    res.sendStatus(404);
  }
})
app.put('/deleteitem/:id', passport.authenticate('basic', {session: false}), (req, res) => {
  const result = users.find(t => t.id == req.params.id);
  if(result != -1){
    items.splice(result, 1);
    res.sendStatus(200)
  }
  else{
    res.sendStatus(404);
  }
})

app.get('/getitems/:category', (req, res) => {
  const result = items.find(t => t.category == req.params.category);
  if (result != undefined)
  {
    res.json(result);
  }
  else{
    res.sendStatus(404);
  }
})
app.get('/getitems', (req, res) => {
  res.json(items);
});

app.post('/sendImages', multerUpload.array('testFiles', 4), (req, res) => {
console.log(req.files);
req.files.forEach(f => {
  fs.renameSync(f.path, './uploads/' + f.originalname)
})
res.send("Completed");
});


app.listen(port, () => {
    console.log(`WeatherApi is now running in  localhost:${port}`);
});
