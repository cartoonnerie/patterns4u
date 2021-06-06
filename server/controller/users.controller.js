import debug from 'debug'
import * as services from '../services/users.services.js'
const DEBUG = debug('dev')

async function userById (id, res) {
  if (!id) { res.sendStatus(400) }
  try {
    const user = await services.getUserById(id)
    if (!user) { res.sendStatus(404) }
    res.status(200).send(user)
  }
  catch (error) {
    DEBUG(error)
    res.sendStatus(500)
  }
}

async function userPatternsByUserId (id, res) {
  // TODO catch appropriate error for user not found
  if (!id) { res.sendStatus(400) }
  try {
    const patterns = await services.getPatternsByUserId(id)
    res.status(200).send(patterns)
  }
  catch (error) {
    DEBUG(error)
    res.status(500).send()
  }
}

export async function getUserById (req, res) {
  const { id } = req.params
  await userById(id)
}

export async function getUserPatterns (req, res) {
  const { id } = req.params
  await userPatternsByUserId(id)
}

export async function getMyUser (req, res) {
  const { id } = req.auth
  await userById(id)
}

export async function getMyPatterns (req, res) {
  const { id } = req.auth
  await userPatternsByUserId(id)
}
