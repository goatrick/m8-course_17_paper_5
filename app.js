import http from "http";
import https from "https";

import fs from "fs";

//Import the router
import { HTTPServer, HTTPSServer } from "./controllers/index.js";
const httpPort = process.env.PORT || 8080;
const httpsPort = 443;


const SSLOptions = {
    key: fs.readFileSync("./utils/ssl/private-key.pem"),
    cert: fs.readFileSync("./utils/ssl/certificate.pem")
}

const httpServer = http.createServer(HTTPServer);
const httpsServer = https.createServer(SSLOptions, HTTPSServer);


httpServer.listen(httpPort, () => {
    console.log(`HTTP Server started at ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server started at ${httpsPort}`);
});












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
*/