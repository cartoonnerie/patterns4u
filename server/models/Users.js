import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { serverSecret } from '../config/server.config.js'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 1
  },
  ravelryId: {
    type: String,
    unique: true,
    minLength: 1
  },
  boughtPatterns: {
    type: [Schema.Types.ObjectId],
    default: []
  }
})

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date()
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10)
  }, serverSecret)
}

UserSchema.methods.toAuthJSON = function () {
  const object = this.toObject({ versionKey: false })
  return {
    ...object,
    token: this.generateJWT()
  }
}

const Users = mongoose.model('Users', UserSchema)
export default Users
