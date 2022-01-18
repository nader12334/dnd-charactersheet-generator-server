const models = require("../models/dndmodels");
const { CharacterSheet, User } = models;
const bcrypt = require("bcrypt");

const userController = {};


userController.verifyUser = (req, res, next) => {
  console.log("Where is my body?", req.body);
  const { username, password } = req.body;
  User.findOne({ username: username }, (err, user) => {
    if (user === null) {
      return next({ error: "User not found" });
    } else {
      if (user.username) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            res.locals.currentUser = user;
            res.locals.currentUserSSID = user._id.toString();
            return next();
          } else if (err) {
            return next()
          }
        })
      }
    }
  });
};

userController.setSSIDCookie = (req, res, next) => {
  res.cookie("ssid", res.locals.currentUserSSID, { domain: "localhost" });
  next();
};

userController.checkSSID = (req, res, next) => {
  console.log(req.cookies)
  User.findOne({username: req.cookies.ssid}, (err, user)=> {
    if (err) return next(err)
    res.locals.currentUser = user
    next()
  })
}

// userController.getCharData = (req, res, next) => {
//   CharacterSheet.findOne({ _id: req.params.id }, (err, sheet) => {
//     if (err) {
//       return next(err);
//     } else {
//       res.locals.sheet = sheet;
//       next();
//     }
//   });
// };

// userController.getUserData = (req, res, next) => {
//   console.log(req.params)
//   User.findOne({ username: req.params.id })
//   .populate('characterSheets')
//   .exec((err, user) => {
//     console.log(err, user)
//     const characterNames = user.characterSheets.map((n) => {
//       return { characterName: n.name, characterId: n._id };
//     });
//     res.locals.characters = characterNames;
//     next();
//   });
// };

module.exports = userController;
