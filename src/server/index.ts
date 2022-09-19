import express from "express";
import { api } from "./api";
import session from "cookie-session";
import { auth } from "./auth";
import helmet from 'helmet';
import compression from 'compression';
import sslRedirect from 'heroku-ssl-redirect';
import path from 'path';
import csurf from "csurf";
import cors from 'cors';

const app = express();

console.log({
    env: process.env
})
// https://www.codeconcisely.com/posts/how-to-set-up-cors-and-cookie-session-in-express/
if (process.env["NODE_ENV"] === "production") {
    app.use(myLog(session({
        secret: process.env['SESSION_SECRET'],
        sameSite: 'none',
        secure: true
    })));
    app.enable('trust proxy');
}
else {//dev
    app.use(session(myLog({
        secret: 'my secret',
        sameSite: false,
        secure: false,
        httpOnly: false
    })));
}
app.use(cors({
    origin: [
        'http://127.0.0.1:5173', // local vite dev server
        'http://127.0.0.1:3002', //local node express server
        'https://still-peak-52201.herokuapp.com' //production site for the app
    ],
    credentials: true
}));
app.use(sslRedirect());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(auth);
app.use('/api', csurf());
app.use("/api", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});
app.use(api);
app.use(express.static(path.join(__dirname, '../')));
app.get('/*', function (_, res) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
});

app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));

function myLog<T>(a: T) {
    console.log(a);
    return a;
}