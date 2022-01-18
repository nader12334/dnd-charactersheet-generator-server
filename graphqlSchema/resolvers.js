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
    getUserByUsername: async (parent, args, context, info) => {
      return await User.findOne({username: args.username}).populate('characterSheets')
    },
    getCharById: async (parent, args, context, info) => {
      return await CharacterSheet.findOne({_id: args.id})
    },
    login: async (parent, args, context, info) => {
      try{
        const verifiedUser = await User.findOne({username: args.username}).populate('characterSheets')
        authentication = await comparePassword(args.password, verifiedUser.password)
        return authentication ? verifiedUser : null 
      } catch (err){
        return null
      }
    },
  },
  Mutation: {
    saveSheet: async (parent, args, context, info) => {
      const { characterSheet, user } = args;
      const newSheet = await CharacterSheet.findOneAndUpdate({name: characterSheet.name, username: user.username }, characterSheet, {new: true, upsert: true})
      const currentUser = await User.findOne({ username: user.username })

      if (!currentUser.characterSheets.includes(newSheet._id)) {
        currentUser.characterSheets.push(newSheet._id)
      }

      await currentUser.save();
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
    deleteSheet: async (parent, args, context, info) => {
      const { characterSheet, user } = args;
      const currentUser = await User.findOne({username: user.username}).populate("characterSheets")
      const deletedSheet = await CharacterSheet.findOneAndDelete({
         name: characterSheet.name, 
         username: characterSheet.username
      })
      currentUser.characterSheets.pull(deletedSheet._id)
      await currentUser.save()
      return currentUser;
    },
  },
};
