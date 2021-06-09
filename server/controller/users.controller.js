import debug from 'debug'
import * as services from '../services/users.services.js'
const DEBUG = debug('dev')

async function userById (id, res, filterType = 'public') {
  if (!id) { res.sendStatus(400) }
  try {
    const user = await services.getUserById(id, filterType)
    res.status(200).send(user)
  }
  catch (error) {
    DEBUG(error)
    if (error.name === 'NotFoundError') {
      res.status(404).send(error.message)
    }
    res.sendStatus(500)
  }
}

async function userPatternsByUserId (id, res, filterType = 'public') {
  if (!id) { res.sendStatus(400) }
  try {
    const patterns = await services.getPatternsByUserId(id, filterType)
    res.status(200).send(patterns)
  }
  catch (error) {
    DEBUG(error)
    if (error.name === 'NotFoundError') {
      res.status(404).send(error.message)
    }
    res.sendStatus(500)
  }
}

export async function getUserById (req, res) {
  const { id } = req.params
  await userById(id, res)
}

export async function getUserPatterns (req, res) {
  const { id } = req.params
  await userPatternsByUserId(id, res)
}

export async function getMyUser (req, res) {
  const { id } = req.auth
  await userById(id, res, 'private')
}

export async function getMyPatterns (req, res) {
  const { id } = req.auth
  await userPatternsByUserId(id, res, 'private')
}
