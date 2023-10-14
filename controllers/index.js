import url from "url";
import userRouter from "../routes/index.js";

function RootGetController(req, res) {
    res.end("<h1>Hello World from GET Method from /. Today is my first DevOps Session </h1>");
}

function HelloGetController(req, res) {
    res.end("<h1>Hello World from GET Method from /hello and this is coming from controllers directory </h1>");
}

function AboutGetController(req, res) {
    res.end("<h1>Hello World from GET Method from /about </h1>");
}

function RootPostController(req, res) {
    console.log(req.body);
    res.end("<h1>Hello World from POST Method from / </h1>");
}

function RootPutController(req, res) {
    console.log(req.body);
    res.end("<h1>Hello World from PUT Method from / </h1>");
}

function RootDeleteController(req, res) {
    res.end("<h1>Hello World from DELETE Method from / </h1>");
}


function RitvikController(req, res) {
    res.end("<h1>Hello World from Ritvik / </h1>");
}

function NotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end("<h1> Not Found </h1>");
}

function InvalidHTTPMethod(req, res) {
    res.writeHead(405, { 'Content-Type': 'text/html' });
    res.end("<h1> Invalid Method </h1>");
}

async function bodyParser(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            body = (body) ? JSON.parse(body) : {};
            resolve(body);
        });
        req.on("error", (error) => {
            reject(error);
        });
    });
}

async function HTTPServer(req, res) {
    // Redirect HTTP to HTTPS
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    res.writeHead(301, { Location: httpsUrl });
    res.end();
}

async function HTTPSServer(req, res) {
    try {
        const parsedURL = url.parse(req.url, true);
        const queryParams = parsedURL.query;
        const method = req.method.toUpperCase();
        const routeName = parsedURL.pathname;
        console.log(method, routeName);
        if (userRouter[method]) {
            if (userRouter[method][routeName]) {
                req.body = await bodyParser(req);
                userRouter[method][routeName](req, res);
            } else {
                NotFound(req, res);
            }
        } else {
            InvalidHTTPMethod(req, res)
        }
    } catch (error) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end("<h1> Internal Server Error. Try Again </h1>");
    }
}

export {
    RootGetController, HelloGetController, AboutGetController,
    RootPostController, RootPutController, RootDeleteController,
    RitvikController, NotFound, InvalidHTTPMethod, 
    HTTPServer, HTTPSServer
}