import mongoose from 'mongoose'
import User from './User.js'

const Schema = mongoose.Schema

const PatternSchema = new Schema({
  ravelry_id: String,
  name: { type: String, required: true },
  creator: {
    type: String,
    required: true,
    validate: {
      validator (id) {
        return User.findById(id, (_, record) => record != null)
      },
      message: 'No user with provided id was found'
    }
  },
  gauge: Number,
  isDraft: { type: Boolean, default: true },
  description: {
    _id: false,
    placeholders: [{
      values: {
        type: Map,
        of: Number
      }
    }],
    content: [{
      _id: false,
      required: false,
      type: {
        type: String,
        enum: ['paragraph'],
        required: true
      },
      data: {
        _id: false,
        type: mongoose.Mixed,
        required: true
      }
    }]
  },
  sizes: {
    type: [{
      name: { type: String, default: '' },
      dimensions: [{
        _id: false,
        name: { type: String, default: '' },
        value: { type: Number }
      }]
    }],
    default: () => []
  },
  thumbnail: { type: String }
})

const Pattern = mongoose.model('Pattern', PatternSchema)
export default Pattern
