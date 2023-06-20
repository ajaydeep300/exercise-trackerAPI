# Exercise Tracker

This is CODE for the Exercise Tracker project.

breakdown of THE code:

----const express = require('express') : This line is requiring the express module. Express is a fast, unopinionated, and minimalist web framework for Node.js

----const app = express(): This line is creating an express application.

----const cors = require('cors'): This line is requiring the cors module. CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

----require('dotenv').config(): This line is requiring the dotenv module. Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.

----const mongoose = require('mongoose'): This line is requiring the mongoose module. Mongoose provides a straight-forward, schema-based solution to model your application data with MongoDB.

----const bodyParser = require('body-parser'): This line is requiring the body-parser module. Body-parser is a piece of express middleware that reads a form's input and stores it as a javascript object accessible through req.body.

----mongoose.connect(process.env.MONGO_URI);: This line is connecting to your MongoDB database using mongoose. The connection string is fetched from your environment variables.

----const userSchema = new mongoose.Schema({...});: This line is creating a new mongoose schema for the user which includes username and a log array with the description, duration, and date.

----const User = mongoose.model('User', userSchema);: This line is creating a new mongoose model named 'User' from the userSchema.

----app.use(cors()): This line is using the CORS middleware in the app.

----app.use(express.static('public')): This line is serving static files in the public directory.

----app.use(bodyParser.urlencoded({ extended: false }));: This line is using the body-parser middleware in the app to parse urlencoded bodies.

----app.get('/', (req, res) => { res.sendFile(__dirname + '/views/index.html') });: This line sets up a route to serve the index.html file when the root ('/') is accessed.

----app.route('/api/users')...: This block of code sets up the POST and GET routes for '/api/users'. The POST route saves a new user to the database and the GET route retrieves all the users from the database.

----app.post('/api/users/:_id/exercises', function(req, res) {...}): This block of code sets up the POST route for '/api/users/:_id/exercises'. This route saves an exercise to a specific user in the database.

    This is an Express route handler for a POST request to '/api/users/:_id/exercises'. The function receives a request (req) and a response (res) object and it does the following:

It uses the Mongoose method findById to find a user in the MongoDB database with the ID provided in the request parameters (req.params._id).
If there's an error, it sends a JSON response with the error.
It creates a new exercise object using the description, duration, and date information from the request body (req.body). If no date is provided, it defaults to the current date.
It then pushes this new exercise object into the user's log array.
After this, it saves the updated user object in the database. If there's an error, it sends a JSON response with the error.
It creates a response object containing the user's _id, username, and the exercise details.
It sends a JSON response with the response object.



----app.get('/api/users/:_id/logs', function(req, res) {...}): This block of code sets up the GET route for '/api/users/:_id/logs'. This route retrieves the exercise log of a specific user from the database. It also handles the optional from, to, and limit parameters.

    [responseObj.log.filter(...)]

This line of code is using the Array.prototype.filter method, which creates a new array with all elements that pass the test implemented by the provided function. In this case, it's creating a new log array with only the logs (referred to as session in the callback function) where the date property is between the fromDate and toDate.

For each session in responseObj.log:

It creates a sessionDate variable that represents the date of the log, converted into milliseconds since the Unix Epoch (January 1, 1970 00:00:00 UTC). This is done with new Date(session.date).getTime().
It then checks if this sessionDate is greater than or equal to fromDate and less than or equal to toDate. If both of these conditions are met, the session log passes the test and is included in the new log array.
if(req.query.limit) {...}

This if statement checks if the limit query parameter exists in the request. If it does, it further limits the number of logs in the log array.

responseObj.log.slice(0, req.query.limit);

This line of code is using the Array.prototype.slice method, which returns a shallow copy of a portion of an array into a new array object. In this case, it's creating a new log array with only the logs from index 0 up to (but not including) the index of req.query.limit. This effectively limits the number of logs in the log array to the limit query parameter. If the limit is greater than the number of logs in the array, all logs will be included.







----app.get('/mongostat', function(req, res){...}): This block of code sets up a GET route to check the connection status with the MongoDB database.

const listener = app.listen(process.env.PORT || 3000, () => {...}): This line starts the server listening on a port, either provided by the environment variable PORT or defaulting to 3000. It also logs a message to the console indicating the port number on which the server is listening.
