const mongoose = require("mongoose");
const {Schema, model} = mongoose
const MONGO_URI = `mongodb+srv://docPalOwner:docPal123@cluster0.ftr2x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "dndcharactersheets",
  })
  .then(console.log('Connected to mongoDB'))
  .catch((err)=> {console.log('Failed to connect to DB, Check models/dndmodels.js')})

const characterSheetSchema = new Schema({
  name: {type: String, required: true},
  username: {type: String, required: true},
  characterDescription: {
    personality: String,
    bonds: String,
    ideals: String,
    flaws: String,
    Alignment: String
  },
  info: {
    level: Number,
    jobs: [{
        class: String,
        level: Number
    }],
    Race: String,
    Background: String,
    experience: Number
  },
  mainStats: {
    Strength: Number,
    Dexterity: Number,
    Constitution: Number,
    Intelligence: Number,
    Wisdom: Number,
    Charisma: Number
  },
  languageAndProficiencies: [String],
  armorClass: Number,
  speed: Number,
  attacksAndSpells: [String],
  featuresAndTraits: [String],
  equipment: [{
      index: String,
      quantity: Number
  }]
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

const CharacterSheet = model("charactersheet", characterSheetSchema);
const User = model("user", userSchema)

  module.exports = {
    CharacterSheet,
    User,
  }