const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var mongoose=require('mongoose');
const bodyParser = require('body-parser');


app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String, required:true}
});

const exerciseSchema = new Schema({
  userid: {type:Object, required:true},
  description: {type:String},
  duration: {type:Number},
  date:{type:Date, required:false}
}
);

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req,res) =>{
  try{
    var user = new User({'username':req.body.username});
    user.save().then(savedUser=>{
    res.json({'username': savedUser.username, '_id':savedUser._id});})
  }
  catch (err)
  {
    console.log(err);
  }
})

/*app.get("/api/deleteusers", async (req,res) =>{
  try{
    User.deleteMany({}).then(result=>{
    res.json(result);})
  }
  catch (err)
  {
    console.log(err);
  }
})*/

app.get("/api/users", async (req,res) =>{
  try{
    User.find().then(result=>{
    res.json(result);})
  }
  catch (err)
  {
    console.log(err);
  }
})


app.post("/api/users/:_id/exercises", async (req,res) =>{
  try{
    User.findOne({'_id':req.params._id}).then(userResult=>{
    if(req.body.date == null)
      var exercise = new Exercise({'userid':req.params._id, 'description':req.body.description, 'duration':req.body.duration, 'date':new Date().toDateString()});
    else
      var exercise = new Exercise({'userid':req.params._id, 'description':req.body.description, 'duration':req.body.duration, 'date':req.body.date});
    exercise.save().then(savedExercise=>{
    res.json({'_id':userResult._id, 'username':userResult.username, 'description':savedExercise.description, 'duration':savedExercise.duration, 'date':savedExercise.date});})});
  }
  catch (err)
  {
    console.log(err);
  }
})

app.get("/api/users/:_id/logs", async (req,res) =>{
  try{
    const id = req.params._id;
    const {from, to, limit} = req.query;
    const user = await User.findById(id)
    let dateObj = {};
    if (from)
      dateObj["$gte"] = new Date(from);
    if (to)
      dateObj["$lte"] = new Date(to);
    let filter = {
      userid: id
    }
    if(from || to)
      filter.date = dateObj;

    const exercises = await Exercise.find(filter).limit(+limit ?? 500)
    const log = exercises.map(e=>({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString()
    }));
    res.json({
      'username':user.username, 
      'count':exercises.length,
      '_id': user._id,
      log})
  }
  catch (err)
  {
    console.log(err);
  }
})

app.get("/api/deleteexercises", async (req,res) =>{
  try{
    Exercise.deleteMany({}).then(result=>{
    res.json(result);})
  }
  catch (err)
  {
    console.log(err);
  }
})

/*app.get("/api/users/:_id/exercises", async (req,res) =>{
  try{
    var userResult;
    var exerciseResult;
    User.findOne({'_id':req.params._id}).then (result=>{
      userResult = result;
    });
    Exercise.find({'_id':req.params._id}).then(result=>{
      exerciseResult = result;
    res.json([userResult, exerciseResult]);})
  }
  catch (err)
  {
    console.log(err);
  }
})*/


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

exports.UserModel = User;
exports.ExerciseModel = Exercise;
//exports.createAndSaveUser = createAndSaveUser;
//exports.createAndSaveExercise = createAndSaveExercise;
