import User from '../models/Users.js'
import Pattern from '../models/Pattern.js'
import { NotFoundError } from '../helpers/errors.js'
import * as patternServices from './patterns.services.js'

const filters = {
  public: null,
  private: { versionKey: false }
}

export async function getUserById (id, filterType = 'public') {
  const result = await User.findById(id, filters[filterType])
  if (!result) { throw new NotFoundError('user not found') }
  return result
}

export async function getPatternsByUserId (id) {
  const user = await User.findById(id)
  if (!user) { throw new NotFoundError('user not found') }
  const patterns = await Pattern.find({ creator: id }, patternServices.filters.public)
  return patterns
}

export function boughtThatPattern (userId, patternId) {
  // TODO
  return false
}
