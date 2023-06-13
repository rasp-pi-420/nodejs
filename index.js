var ping = require("net-ping");
const bodyParser = require("body-parser");
const os = require("os");
const rlp = require("roblox-long-polling");
const express = require("express");
const exp = require("constants");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var connect;
const poll = new rlp({
  port: 2004, // Add this behind your IP, example: http://127.0.0.1:2004,
  //password: "passsword here" If you want to add a simple password, put uncomment this and add your password
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/ping", (req, res) => {
  var session = ping.createSession();

  session.pingHost(target, function (error, target) {
    if (error) res.send(target + ": " + error.toString());
    else res.send(target + ": Alive");
  });
});
app.get("/execute-code", (req, res) => {
  let code = req.query.code;
  let whitelistId = "admin";
  console.log(whitelistId, code);
  code = code.replace(/"/g, "'");
  try {
    connect.send(
      `runCode`,
      "OWNERWASHERELMAOMLAJSFDOHAEFUHI" +
        code +
        "OWNERWASHERELMAOMLAJSFDOHAEFUHI"
    );
  } catch (e) {
    res.send(e);
  }
  res.send("ok");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

poll.on("connection", (connection) => {
  connect = connection;
  console.log("New connection", connection.id); // Will fire when a new connection is active, and include this IP address.
  poll.broadcast("new connection", connection.id); // Will broadcast to all active sockets that this one has joined the part.
  connection.send("welcome", "hello there!"); // Will send a welcome message to the new socket.
  connection.on("hello", (data) => {
    //On a event we will handle the hello message
    console.log("received hello message!", data);
  });

  connection.on("internal_ping", () => {
    //We receive pings from the server to let us know its still alive, you cant disable this.
  });
  connection.on("GameId", (id) => {
    console.log(id);
  });
  connection.on("dsconnect", () => {
    // Fired when the game sends a disconnect command, or our timeout is fired.
    console.log("Disconnection", connection.id);
    poll.broadcast("disconnection", connection.id);
  });
});
