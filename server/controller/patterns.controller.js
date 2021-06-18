import debug from 'debug'
import Pattern from '../models/Pattern.js'
import * as services from '../services/patterns.services.js'
const DEBUG = debug('dev')
// import extraction from './extractionOfInformation/extractionData.js'

export async function getAllPatterns (req, res) {
  const patterns = await Pattern.find({}, services.filters.public)
  res.status(200).send(patterns)
}

export async function createPattern (req, res) {
  const pattern = { ...req.body, creator: req.auth.id }
  const newPattern = new Pattern(pattern)
  await newPattern.save()
  res.status(201).send(newPattern)
}

export function getPatternById (req, res) {
  async function findAndSend (id, filterType) {
    const pattern = await Pattern.findById(id, services.filters[filterType])
    res.status(200).send(pattern)
  }
  const { id } = req.params
  services.checkBought(
    req.params.id, req.auth.id,
    () => { findAndSend(id, 'private') },
    () => { findAndSend(id, 'public') })
}

export async function deletePatterns (req, res) {
  async function onSuccess () {
    const pattern = await Pattern.deleteOne(req.params.id)
    res.status(200).send(pattern)
  }
  return await services.checkOwnerAndAct(req.params.id, req.auth.id, onSuccess)
}

export async function updatePattern (req, res) {
  async function onSuccess () {
    const pattern = await Pattern.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).send(pattern)
  }
  return await services.checkOwnerAndAct(req.params.id, req.auth.id, onSuccess)
}

export async function getBoughtPatterns (req, res) {
  const { userId } = req.auth
  if (!userId) { res.sendStatus(400) }
  const patterns = await services.getBoughtPatterns(userId)
  res.status(200).send(patterns)
}

export async function getPatternPDF (req, res) {
  // TODO handle errors more precisely
  // eslint-disable-next-line no-unused-vars
  const pattern = await services.getPatternById(req.params.id, services.filters.private)

  services.checkBought(
    req.params.id, req.auth.id,
    () => {
      // eslint-disable-next-line no-unused-vars
      const { size } = req.query
      const data = '' // extraction.findDataBySize(pattern, size)

      // send data
      const buffers = []
      data.on('data', (chunk) => {
        DEBUG('Chuck DATA', chunk)
        buffers.push(chunk)
      })
      data.on('end', () => {
        const filePdf = Buffer.concat(buffers)
        res.set('Content-Type', 'application/pdf')
          .status(200)
          .send(filePdf)
      })
    }
  )
}
