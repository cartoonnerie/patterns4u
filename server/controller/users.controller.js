import * as services from '../services/users.services.js'

async function userById (id, res, filterType = 'public') {
  if (!id) { res.sendStatus(400) }
  const user = await services.getUserById(id, filterType)
  res.status(200).send(user)
}

async function userPatternsByUserId (id, res, filterType = 'public') {
  if (!id) { res.sendStatus(400) }
  const patterns = await services.getPatternsByUserId(id, filterType)
  res.status(200).send(patterns)
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
