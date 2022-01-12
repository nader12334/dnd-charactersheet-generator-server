const mongoose = require("mongoose");
const pass = require('./pass.json')
const MONGO_URI = `mongodb+srv://docPalOwner:docPal123@cluster0.ftr2x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: "dndcharactersheets",
  })
  .then(() => console.log("Connected to Mongo DB."))
  .catch((err) => console.log(err));

  const Schema = mongoose.Schema;

  const characterSheetSchema = new Schema({
    name: String,
    characterDescription: {
      "Player Name": String,
      personality: String,
      bonds: String,
      ideals: String,
      flaws: String,
      Alignment: String
    },
    info: {
      level: Number,
      class: Object,
      Race: String,
      Background: String,
      "Experience Points": Number
    },
    mainStats: {
      Strength: Number,
      Dexterity: Number,
      Constitution: Number,
      Intelligence: Number,
      Wisdom: Number,
      Charisma: Number
    },
    languageAndProficiencies: Array,
    armorClass: Number,
    speed: Number,
    attacksAndSpells: Array,
    featuresAndTraits: Array,
    equipment: Array
  })

  const userSchema = new Schema({
    username: {type: String, unique : true, required : true},
    password: {type: String, required: true},
    characterSheets: [
      {
        type: Schema.Types.ObjectId,
        ref: "charactersheet"
      }
    ]
  })
  const CharacterSheet = mongoose.model("charactersheet", characterSheetSchema);
  const User = mongoose.model("user", userSchema)

  module.exports = {
    CharacterSheet,
    User,
  }