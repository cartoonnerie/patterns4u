import { Schema, Mixed, model } from 'mongoose'
import User from './User'

const PatternSchema = new Schema({
  ravelry_id: String,
  name: {
    type: String,
    required: true
  },
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
  isDraft: {
    type: Boolean,
    default: true
  },
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
        type: Mixed,
        required: true
      }
    }]
  },
  sizes: [{
    name: String,
    dimensions: [{
      _id: false,
      name: String,
      value: Number
    }]
  }],
  thumbnail: String
})

const Pattern = model('Pattern', PatternSchema)
export default Pattern
