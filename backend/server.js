import app from "./src/app.js";
import connectDB from "./src/db/db.js";
// import setupSocket from "./src/sockets/socket.js";

// import { createServer } from "http";

// const httpServer = createServer(app);

// setupSocket(httpServer);

connectDB();

// httpServer.listen(3000,()=>{
//     console.log("Server is running on port 3000");
// })
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

  