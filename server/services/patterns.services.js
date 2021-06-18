import Pattern from '../models/Pattern.js'
import { NotFoundError, NotYourPatternError, BuyThatPatternError } from '../helpers/errors.js'
import * as userServices from './users.services.js'

export const filters = {
  public: { versionKey: false },
  private: { explanation: false, versionKey: false }
}

export async function getPatternById (id, filters = '') {
  const result = await Pattern.findById(id, filters)
  if (!result) { throw new NotFoundError('pattern not found') }
  return result
}

export async function checkOwnerAndAct (patternId, requesterId, onSuccess, onFailure = null) {
  onFailure = onFailure || (() => { throw new NotYourPatternError() })
  const { creator } = await getPatternById(patternId, 'creator')
  if (creator) { return onSuccess() }
  return onFailure()
}

export function checkBought (patternId, requesterId, onSuccess, onFailure = null) {
  onFailure = onFailure || (() => { throw new BuyThatPatternError() })
  if (userServices.boughtThatPattern(requesterId, patternId)) {
    return onSuccess()
  }
  return onFailure()
}

export async function getBoughtPatternFromUser (userId) {
  // TODO
}
