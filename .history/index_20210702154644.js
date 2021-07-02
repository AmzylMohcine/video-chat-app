const app = require("express")();
const server = require("http").createServer(app); 

const cors = require("cors"); 

const io = require("socket.io")(server, {
    cors: {
        origin: "*" ,
        methods : [     "GET" , "POST"]
    }
}) ; 

