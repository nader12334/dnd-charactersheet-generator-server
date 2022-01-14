const {gql} = require('apollo-server-express')

const models = require("../models/dndmodels");
const { CharacterSheet, User } = models;
const bcrypt = require("bcrypt");

module.exports = gql`
  type CharacterDescription {
    playerName: String
    personality: String
    bonds: String
    ideals: String
    flaws: String
    Alignment: String
  }

  type MainStats {
    Strength: Int
    Dexterity: Int
    Constitution: Int
    Intelligence: Int
    Wisdom: Int
    Charisma: Int
  }

  type Job {
    class: String
    level: Int
  }

  type Info {
    level: Int
    jobs: [Job]
    Race: String
    Background: String
    experience: Int
  }

  type Equipment {
    index: String
    quantity: Int
  }

  type CharacterSheet {
    id:ID
    name: String!
    characterDescription: CharacterDescription
    info: Info
    mainStats: MainStats
    languageAndProficiencies: [String]
    armorClass: Int
    speed: Int
    attacksAndSpells: [String]
    featuresAndTraits: [String]
    equipment: [Equipment]
  }

  type UnpopulatedUser {
    id:ID
    username: String
    password: String
    characterSheets: [ID]
  }

  type User {
    id:ID
    username: String
    password: String
    characterSheets: [CharacterSheet]
  }

  input UserInput {
    id:ID
    username: String
    password: String
  }
  
  input CharacterDescriptionInput {
    playerName: String
    personality: String
    bonds: String
    ideals: String
    flaws: String
    Alignment: String
  }
  
  input MainStatsInput {
    Strength: Int
    Dexterity: Int
    Constitution: Int
    Intelligence: Int
    Wisdom: Int
    Charisma: Int
  }
  
  input JobInput {
    class: String
    level: Int
  }
  
  input InfoInput {
    level: Int
    jobs: [JobInput]
    Race: String
    Background: String
    experience: Int
  }
  
  input EquipmentInput {
    index: String
    quantity: Int
  }
  
  input SheetInput {
    name: String!
    characterDescription: CharacterDescriptionInput
    info: InfoInput
    mainStats: MainStatsInput
    languageAndProficiencies: [String]
    armorClass: Int
    speed: Int
    attacksAndSpells: [String]
    featuresAndTraits: [String]
    equipment: [EquipmentInput]
  }
  
  type Query {
    getAllCharacterSheets: [CharacterSheet]
    getAllUsers: [User]
    getUserById(id:ID): User
    login(username: String, password:String): User
  }

  type Mutation {
    createSheet(characterSheet: SheetInput, user: UserInput): CharacterSheet
    createUser(characterSheet: SheetInput, user: UserInput): UnpopulatedUser 
  }
`