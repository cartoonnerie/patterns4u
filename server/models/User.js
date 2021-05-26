import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  email: String
})

const User = model('User', UserSchema)
export default User
