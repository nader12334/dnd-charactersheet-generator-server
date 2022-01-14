const { gql } = require("apollo-server-express");
const models = require("../models/dndmodels");
const { CharacterSheet, User } = models;
const bcrypt = require("bcrypt");

const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
const comparePassword = (password, storedPassword) =>
  new Promise((resolve, reject) => {
  bcrypt.compare(password, storedPassword, (err, hash) => {
    if (err) reject(err);
    resolve(hash);
  })
})

module.exports = {
  Query: {
    getAllCharacterSheets: async () => {
      return await CharacterSheet.find();
    },
    getAllUsers: async () => {
      return await User.find().populate("characterSheets");
    },
    getUserById: async (parent, args, context, info) => {
      return await User.findOne({_id: args.id}).populate('characterSheets')
    },
    login: async (parent, args, context, info) => {
      const verifiedUser = await User.findOne({username: args.username}).populate('characterSheets')
      authentication = await comparePassword(args.password, verifiedUser.password)
      return authentication ? verifiedUser : null 
    },
  },
  Mutation: {
    createSheet: async (parent, args, context, info) => {
      const { characterSheet, user } = args;
      const newSheet = new CharacterSheet(characterSheet);
      await newSheet.save();
      let currentUser;
      if (user.id) {
        currentUser = await User.findOne({ _id: user.id });
      } else {
        currentUser = await User.findOne({ username: user.username });
      }
      currentUser.characterSheets.push(newSheet._id);
      await currentUser.save();
      console.log(characterSheet);
      console.log(newSheet);
      return newSheet;
    },
    createUser: async (parent, args, context, info) => {
      const { characterSheet, user } = args;
      const newSheet = new CharacterSheet(characterSheet);
      user.password = await hashPassword(user.password);
      const newUser = new User(user);
      newUser.characterSheets.push(newSheet._id)
      await Promise.all([newUser.save(),newSheet.save()])
      return newUser;
    },
  },
};
