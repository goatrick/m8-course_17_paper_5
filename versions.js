// import http from "http";
// import https from "https";

// import fs from "fs";

// //Import the router
// import { HTTPServer, HTTPSServer } from "./controllers/index.js";
// const httpPort = process.env.PORT || 80; //only works for domain will work if there are sudo permissions 
// const httpsPort = 443;


// const SSLOptions = {
//     key: fs.readFileSync("./utils/ssl/private-key.pem"),
//     cert: fs.readFileSync("./utils/ssl/certificate.pem")
// }

// const httpServer = http.createServer(HTTPServer);
// const httpsServer = https.createServer(SSLOptions, HTTPSServer);


// httpServer.listen(httpPort, () => {
//     console.log(`HTTP Server started at ${httpPort}`);
// });

// httpsServer.listen(httpsPort, () => {
//     console.log(`HTTPS Server started at ${httpsPort}`);
// });



// import express from "express";
// import https from "https";
// import http from "http";
// import fs from "fs";

// const app = express();
// const httpPort = 8080;
// const httpsPort = 443;

// const SSLOptions = {
//     key: fs.readFileSync("utils/ssl/private-key.pem"),
//     cert: fs.readFileSync("utils/ssl/certificate.pem")
// };

// // Import Routers
// import tasksRouter from "./routes/tasksRouter.js";
// import adminRouter from "./routes/adminRouter.js";

// app.use(express.json());

// // It will serve views/index.html at /
// app.use(express.static("views"));

// app.use("/api/tasks", tasksRouter);
// app.use("/admin", adminRouter);

// // Add a middleware to redirect HTTP to HTTPS
// app.use((req, res, next) => {
//   if (req.protocol === 'http') {
//     const httpsUrl = `https://${req.hostname}${req.url}`;
//     return res.redirect(301, httpsUrl);
//   }
//   next();
// });

// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route Not Found" });
// });

// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(SSLOptions, app);

// httpServer.listen(httpPort, () => {
//     console.log(`HTTP Server started at ${httpPort}`);
// });

// httpsServer.listen(httpsPort, () => {
//     console.log(`HTTPS Server started at ${httpsPort}`);
// });



//there should be redirection to the 80 port number like we saw previously and that should occur in production

/*
what exactly do I need to do:

stack: UI --->
 html (create a html or import a placeholder html page), 
 Mongo DB(for validations),
 express(write all logic here),
aws(link with domain and deploy)

redirect the port numbers with my domain ID
    create the servers with redirection and generate ssl keys (if required)
    hook up to the DNS to port forward to my id
Set up my endpoints listed
    look through old vids for basic auth and the node-schedule



recap: it is not running at 443 due to certificate
so 
step 1: get the certificate
step 2: redirection of servers
step 3: this is supposed to use express so route all the endpoints properly
confused navigating the files? then put all in one place using app.get not app.use

step 3: the cron jobs are the ones which are scheduled from the tag
everytime I go to to post it will append to tasks.json and log it there
that is being read by the GET method to display all tasks --->
from the tasks with the specfic time make a cron job --->
the mongo db schema will catch the time in UTC ---> 
make the cron jobs onto the file cron.js to create one
connect to mongdb and everytime I post something then it is stored instead of json

connect with mongo db and seed some data 
and make sure the other get method works
do the cron jobs
if time make sure the cron jobs work to be displayed

why don't I just make the data schema and validate with the 
post method interlink them both

*/



/* this will do basic auth for /admin

import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';

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

// Redirect HTTP to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Create an HTTPS server
const httpsServer = https.createServer(SSLOptions, app);

// Define your routes and handlers here
app.get('/', (req, res) => {
  res.send('Hello, this is the HTTPS server.');
});

// Start HTTP server for redirection
httpServer.listen(httpPort, () => {
  console.log(`HTTP Server (redirection) started at port ${httpPort}`);
});

// Start HTTPS server
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server started at port ${httpsPort}`);
});

*/




/*
//this code will list the different methods to use in post man

import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';

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
app.get('/api/tasks', (req, res) => {
  res.json({ message: 'GET request received' });
});

// Sample route for testing POST requests
app.post('/api/post', (req, res) => {
  res.json({ message: 'POST request received', data: req.body });
});

// Sample route for testing PUT requests
app.put('/api/put', (req, res) => {
  res.json({ message: 'PUT request received' });
});

// Sample route for testing DELETE requests
app.delete('/api/delete', (req, res) => {
  res.json({ message: 'DELETE request received' });
});

// Redirect HTTP to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Create an HTTPS server
const httpsServer = https.createServer(SSLOptions, app);

// Define your routes and handlers here
app.get('/', (req, res) => {
  res.send('Hello, this is the HTTPS server.');
});

// Start HTTP server for redirection
httpServer.listen(httpPort, () => {
  console.log(`HTTP Server (redirection) started at port ${httpPort}`);
});

// Start HTTPS server
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server started at port ${httpsPort}`);
});
*/


/* this will give the mongo db connection
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { ExpressValidator } from 'express-validator';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';
import mongoose from "mongoose";


const atlas_server_info = "mongodb+srv://goatricky:new12345@cs22.bj0qyig.mongodb.net";
const database_name = "ritvik";


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
app.get('/api/tasks', (req, res) => {
  res.json({ message: 'GET request received' });
});

// Sample route for testing POST requests
app.post('/api/post', (req, res) => {
  res.json({ message: 'POST request received', data: req.body });
});

// Sample route for testing PUT requests
app.put('/api/put', (req, res) => {
  res.json({ message: 'PUT request received' });
});

// Sample route for testing DELETE requests
app.delete('/api/delete', (req, res) => {
  res.json({ message: 'DELETE request received' });
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






*/


/* this code will give the queries which is connected to the db 
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
app.get('/api/tasks', (req, res) => {
  res.json({ message: 'GET request received' });
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




app.get('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findOne({ taskId: taskId }).exec();
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Sample route for testing DELETE requests
app.delete('/api/delete', (req, res) => {
  res.json({ message: 'DELETE request received' });
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



*/



