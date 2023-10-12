import express from "express";
const app = express();

//Import DB Connection File
import "./utils/dbConnect.js";

const port = process.env.PORT || 8080;

//Import Routers
import tasksRouter from "./routes/tasksRouter.js";
import adminRouter from "./routes/adminRouter.js";

app.use(express.json()); //json bodyparser


//It will serve views/index.html at / 
app.use(express.static("views"));   //HomeRouter
app.use("/api/tasks", tasksRouter); //TasksRouter
app.use("/admin", adminRouter); //AdminRouter
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not Found" })
});

app.listen(port, () => {
    console.log(`Server Started at ${port}`);
});

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