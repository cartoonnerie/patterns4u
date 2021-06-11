import mongoose from 'mongoose'
import User from './Users.js'

const Schema = mongoose.Schema

const availabilities = ['draft', 'online', 'free']

const filters = {
  public: { versionKey: false },
  private: { explanation: false, versionKey: false }
}

const PatternSchema = new Schema({
  ravelry_id: String,
  name: { type: String, required: true },
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    validate: {
      validator (id) {
        return User.findById(id, null, null, (_, record) => record != null)
      },
      message: 'No user with provided id was found'
    },
    ref: 'User'
  },
  gauge: Number,
  availability: { type: Object, enum: availabilities, default: 'draft' },
  explanation: {
    // TODO rethink with tiptap compatibility
    _id: false,
    placeholders: [{
      values: {
        type: Map,
        of: Number
      }
    }],
    text: [{
      _id: false,
      required: false,
      type: {
        type: String,
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
  thumbnailUrl: { type: String }
})

PatternSchema.pre('findByIdAndUpdate', function (next) {
  this.options.runValidators = true
  next()
})

PatternSchema.methods.getPublic = function () {
  return this.select(filters.public)
}

PatternSchema.methods.getPrivate = function () {
  return this.select(filters.private)
}
const Pattern = mongoose.model('Pattern', PatternSchema)
export default Pattern
