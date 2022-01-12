const models = require("../models/dndmodels");
const { CharacterSheet, User } = models;
const bcrypt = require("bcrypt");

const userController = {};

userController.signUp = (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: "Error during password hashing" });
      next(err);
    } else {
      User.create({ username, password: hash }, (err, response) => {
        if (err) {
          res.status(500).json({
            error: "Error during user creation, username may be taken",
          });
          next(err);
        } else {
          res.locals.currentUser = response;
          res.locals.currentUserSSID = response.username;
          next();
        }
      });
    }
  });
};

userController.createSheet = (req, res, next) => {
  const {
    name,
    characterDescription,
    info,
    mainStats,
    languageAndProficiencies,
    armorClass,
    speed,
    attacksAndSpells,
    featuresAndTraits,
    equipment,
  } = req.body;

  CharacterSheet.create(
    {
      name,
      characterDescription,
      info,
      mainStats,
      languageAndProficiencies,
      armorClass,
      speed,
      attacksAndSpells,
      featuresAndTraits,
      equipment,
    },
    (err, response) => {
      if (err) {
        res.status(500).json({ error: "Error during characterSheet creation" });
        next(err);
      } else {
        res.locals.newSheet = response;
        next();
      }
    }
  );
};

userController.getUsername = (req, res, next) => {
  res.locals.currentUser = { username: req.body.username };
  next();
};

userController.deleteSheet = (req, res, next) => {
  const { name, mainStats } = req.body;
  CharacterSheet.findOneAndDelete({ name, mainStats, }, (err, deletedSheet) => {
    console.log(err, deletedSheet)
    res.locals.deletedSheet = deletedSheet
    next()
  });
}

userController.unlinkSheet = (req, res, next) => {
  const { currentUser, deletedSheet } = res.locals;
  console.log(currentUser, deletedSheet._id)
  User.findOne({ username: currentUser.username }, (err, user) => {
    user.characterSheets.pull(deletedSheet._id);
    user.save((error) => {
      if (error) {
        console.log("error in character delete");
        next(error);
      } else {
        next();
      }
    });
  });
}
userController.linkSheet = (req, res, next) => {
  const { currentUser, newSheet } = res.locals;

  User.findOne({ username: currentUser.username }, (err, user) => {
    user.characterSheets.push(newSheet._id);
    user.save((error) => {
      if (error) {
        console.log("error in user save");
        next(error);
      } else {
        next();
      }
    });
  });
};

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

userController.getCharData = (req, res, next) => {
  CharacterSheet.findOne({ _id: req.query.charId }, (err, sheet) => {
    if (err) {
      return next(err);
    } else {
      res.locals.sheet = sheet;
      next();
    }
  });
};

userController.getUserData = (req, res, next) => {
  console.log(req.params)
  User.findOne({ username: req.params.id })
  .populate('characterSheets')
  .exec((err, user) => {
    console.log(err, user)
    const characterNames = user.characterSheets.map((n) => {
      return { characterName: n.name, characterId: n._id };
    });
    res.locals.characters = characterNames;
    next();
  });
};

module.exports = userController;
