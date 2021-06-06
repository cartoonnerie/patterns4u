import debug from 'debug'
import User from '../models/Users.js'
import Pattern from '../models/Pattern.js'
const DEBUG = debug('dev')

// TODO envoyer les bonnes erreurs

export async function getUserById (id) {
  // TODO seulement bons attrinuts de User
  // TODO possibilité de généraliser le fait de n eprendre que certains attributs du modèle mongoose
  try {
    const result = await User.findById(id)
    if (!result) { return null }
    else { return result }
  }
  catch (error) {
    DEBUG(error)
    throw Error('generic error')
  }
}

export async function getPatternsByUserId (id) {
  try {
    const user = await User.findById(id)
    if (user) {
      const patterns = await Pattern.find({ creator: id })
      return patterns
    }
    else { throw Error('user not found') }
  }
  catch (error) {
    DEBUG(error)
    throw Error('generic error')
  }
}
