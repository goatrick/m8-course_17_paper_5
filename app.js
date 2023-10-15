import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { ExpressValidator } from 'express-validator';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';
import mongoose from "mongoose";


const atlas_server_info = "mongodb+srv://goatricky:new12345@cs22.bj0qyig.mongodb.net";
const database_name = "mock-data";


async function connectDB() {
    try {
        await mongoose.connect(`${atlas_server_info}/${database_name}`);
        console.log("Mongo DB Connected");
    } catch (error) {
        console.log(error);
    }
}

connectDB() 

const app = express();
const httpPort = process.env.HTTP_PORT || 80;
const httpsPort = process.env.HTTPS_PORT || 443;

// SSL options for HTTPS
const SSLOptions = {
  key: fs.readFileSync('./utils/ssl/private-key.pem'),
  cert: fs.readFileSync('./utils/ssl/certificate.pem')
};

// Middleware for parsing JSON body
app.use(bodyParser.json());



app.use(express.json()); //json bodyparse

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});

// Basic Authentication Middleware for "admin" endpoint
const adminAuth = basicAuth({
  users: { 'adminUser': 'Password' }, // Replace with your desired username and password
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
});

// Create an "admin" endpoint with Basic Authentication
app.get('/admin', adminAuth, (req, res) => {
  res.send('Admin Dashboard');
});

// Sample route for testing GET requests
app.get('/api/tasks', async (req, res) => {
  try {
      // Use Model.find({}) to query and retrieve all documents
      const allTasks = await Task.find({}).exec();
      res.json(allTasks);
  } catch (error) {
      console.error('Error reading data from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



const taskSchema = new mongoose.Schema({
    taskId: String,
    taskName: String,
    deadline: Date,
    taskStatus: String,
});

const Task = mongoose.model('Task', taskSchema);


// Create a route to handle GET requests to /api/tasks
app.get('/api/tasks/:taskId', async (req, res) => {
  try {
      const taskId = req.params.taskId;

      // Use Model.findById to find a specific task by its ID
      const task = await Task.findById(taskId).exec();

      if (!task) {
          // Task not found
          res.status(404).json({ error: 'Task not found' });
      } else {
          // Task found, send it as JSON in the response
          res.json(task);
      }
  } catch (error) {
      console.error('Error reading data from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Sample route for testing POST requests
app.post('/api/post', (req, res) => {
  res.json({ message: 'POST request received', data: req.body });
});

// Sample route for testing PUT requests
app.put('/api/put', (req, res) => {
  res.json({ message: 'PUT request received' });
});

app.delete('/api/delete/:taskid', async (req, res) => {
  try {
      const taskId = req.params.taskid;

      // Use Model.findByIdAndRemove to delete a specific task by its ID
      const deletedTask = await Task.findByIdAndRemove(taskId).exec();

      if (!deletedTask) {
          // Task not found
          res.status(404).json({ error: 'Task not found' });
      } else {
          // Task found and deleted
          res.json({ message: 'Task deleted successfully' });
      }
  } catch (error) {
      console.error('Error deleting data from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Redirect HTTP to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Create an HTTPS server
const httpsServer = https.createServer(SSLOptions, app);


// Define your routes and handlers here
app.use('/', express.static('views'));


// Start HTTP server for redirection
httpServer.listen(httpPort, () => {
  console.log(`HTTP Server (redirection) started at port ${httpPort}`);
});

// Start HTTPS server
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server started at port ${httpsPort}`);
});



