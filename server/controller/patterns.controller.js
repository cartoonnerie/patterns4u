import debug from 'debug'
import Pattern from '../models/Pattern.js'
import * as services from '../services/patterns.services.js'
const DEBUG = debug('dev')
// import extraction from './extractionOfInformation/extractionData.js'

export async function getAllPatterns (req, res) {
  const patterns = await Pattern.find({})
  res.status(200).send(patterns)
}

export async function createPattern (req, res) {
  const pattern = { ...req.body, creator: req.auth.id }
  const newPattern = new Pattern(pattern)
  await newPattern.save()
  res.status(201).send(newPattern)
}

export async function getBoughtPatterns (req, res) {

}

export async function getPatternById (req, res) {
  const pattern = await Pattern.findById(req.params.id)
  services.checkBought(
    req.params.id, req.auth.id,
    () => {
      res.status(200).send(pattern.getPrivate())
    },
    () => {
      res.status(200).send(pattern.getPublic())
    })
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

export async function getPatternPDF (req, res) {
  // TODO handle errors more precisely
  // eslint-disable-next-line no-unused-vars
  const pattern = await services.getPatternById(req.params.id)

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
