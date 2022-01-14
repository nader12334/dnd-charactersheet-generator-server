const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 8080;
const userController = require("./controllers/userController");
const cookieParser = require("cookie-parser");
const whitelist = [
  "http://localhost:3000",
  "http://www.localhost:3000",
  "https://solo-project-dnd.herokuapp.com",
  "https://www.solo-project-dnd.herokuapp.com",
  "http://192.168.1.254:3000",
  "http://www.192.168.1.254:3000"
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      return callback(null, true);
    } else {
      callback(new Error(`origin ${origin} not allowed by CORS`));
    }
  },
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/user",
  userController.signUp,
  userController.createSheet,
  userController.linkSheet,
  userController.setSSIDCookie,
  (req, res) => {
    res
      .status(200)
      .json({ newUser: res.locals.currentUser, newSheet: res.locals.newSheet });
  }
);

app.get("/user/:id", userController.getUserData, (req, res) => {
  res.status(200).json(res.locals.characters);
});

app.get("/char/:id", userController.getCharData, (req, res) => {
  res.status(200).json(res.locals.sheet);
});

app.post(
  "/char",
  userController.getUsername,
  userController.createSheet,
  userController.linkSheet,
  (req, res) => {
    res.status(200).json({ newSheet: res.locals.newSheet });
  }
);

app.delete(
  "/char",
  userController.getUsername,
  userController.deleteSheet,
  userController.unlinkSheet,
  (req, res) => {
    res.status(200).json({ deletedSheet: res.locals.deletedSheet });
  }
);

app.get("/login", userController.checkSSID, (req, res) => {
  res.status(200).json(res.locals.currentUser)
})

app.post(
  "/login",
  userController.verifyUser,
  userController.setSSIDCookie,
  (req, res) => {
    if (res.locals.currentUser) {
      res.status(200).json(res.locals.currentUser);
    } else {
      res.status(500).json({ error: "user not found" })
    }
  }
);

app.post(
  "/loginandsave",
  userController.verifyUser,
  userController.createSheet,
  userController.linkSheet,
  userController.setSSIDCookie,
  (req, res) => {
    res
      .status(200)
      .json({ newUser: res.locals.currentUser, newSheet: res.locals.newSheet });
  }
);

app.use("*", (req, res) => {
  res.status(404).send("Page not Found");
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };

  const errorObj = Object.assign({}, defaultErr, err);

  res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
