const express = require("express");
const app = express();
const { v4: uuidV4 } = require("uuid");
// const fs = require("fs");
// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

let port = process.env.PORT || 3805

const server = require("http").createServer(app).listen(port,() =>{
    console.log("Port : ",port);
});
const io = require("socket.io")(server);



app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});



app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
      console.log("RID : ", roomId);
      console.log("UID : ", userId);
  
      socket.join(roomId);
      socket.to(roomId).broadcast.emit("user-connected", userId);
    });
  });

// server.listen(3000, () => {
//     console.log("Server has started on port no : ", 3000)});
