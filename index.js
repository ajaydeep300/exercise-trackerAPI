const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb+srv://ajaydeep300:lunsharma@cluster0.qlqxdjy.mongodb.net/?retryWrites=true&w=majority');

const userSchema = new mongoose.Schema({
  username: String,
  log: [{
    description: String,
    duration: Number,
    date: String
  }]
});

const User = mongoose.model('User', userSchema);

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
  .post(function(req,res){
  const username = req.body.username;
  const newUser = new User({username});
  newUser.save(function(err,data) {
    if(err){
      res.json({error: err});
    }
    res.json(data); 
  })
})
.get(function(req,res){
  User.find(function(err, data){
    if(err){
      res.json({error: err});
    }
    res.json(data);
  })
})

app.post('/api/users/:_id/exercises', function(req, res) {
  User.findById(req.params._id, function(err, user){
    if(err) {
      return res.json({error: err});
    }
    
    const exercise = {
      description: req.body.description,
      duration: Number(req.body.duration),
      date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
    };

    user.log.push(exercise);

    user.save(function(err, updatedUser) {
      if(err){
        return res.json({error: err});
      }

      const responseObj = {
        _id: updatedUser._id,
        username: updatedUser.username,
        date: exercise.date,
        duration: exercise.duration,
        description: exercise.description
      };

      res.json(responseObj);
    })
  })
});

app.get('/api/users/:_id/logs', function(req, res) {
  User.findById(req.params._id, function(err, user) {
    if(err) {
      return res.json({error: err});
    }
    
    let responseObj = user;
    
    if(req.query.from || req.query.to) {
      let fromDate = new Date(0);
      let toDate = new Date();

      if(req.query.from) {
        fromDate = new Date(req.query.from);
      }

      if(req.query.to) {
        toDate = new Date(req.query.to);
      }

      fromDate = fromDate.getTime();
      toDate = toDate.getTime();

      responseObj.log = responseObj.log.filter((session) => {
        let sessionDate = new Date(session.date).getTime();

        return sessionDate >= fromDate && sessionDate <= toDate;
      });
    }

    if(req.query.limit) {
      responseObj.log = responseObj.log.slice(0, req.query.limit);
    }
    
    responseObj = responseObj.toJSON();
    responseObj['count'] = user.log.length;
    res.json(responseObj);
  });
});


app.get('/mongostat', function(req, res){
  //check if connected to database or not
  console.log(mongoose.connection.readyState);
  res.json({status: mongoose.connection.readyState});
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})