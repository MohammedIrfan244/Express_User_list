const express = require("express");
const app = express();
const port = 4000;
const userArr = [];

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/users", (req, res) => {
  const { name, userName, email } = req.body;
  const userInput = {
    id: userArr.length + 1,
    name,
    userName,
    email,
  };
  userArr.push(userInput);
  res.send("added");
});

app.get("/users/:id", (req, res) => {
  const currentUser = userArr.find((user) => user.id == req.params.id);
  if (currentUser) {
    res.json(currentUser);
  } else {
    res.send("naah");
  }
});

app.put("/users/:id", (req, res) => {
  const currentUser = userArr.find((user) => user.id == req.params.id);
  if (currentUser) {
    currentUser.name = req.body.name;
    currentUser.userName = req.body.userName;
    currentUser.email = req.body.email;
  }
  res.send("patched");
});

app.delete("/users/:id", (req, res) => {
  userArr.splice(req.params.id - 1, 1);
  res.send("patched");
});

app.get("/users", (req, res) => {
  res.json(userArr);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
