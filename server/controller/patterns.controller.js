import Pattern from '../models/Pattern.js'
// import extraction from './extractionOfInformation/extractionData.js'

export async function createPattern (req, res) {
  try {
    const newPattern = new Pattern({ ...req.body })
    await newPattern.save()
    res.send(newPattern)
  }
  catch (error) {
    console.log(error)
    res.send({ error })
  }
}

export async function getAllPatterns (req, res) {
  try {
    const patterns = await Pattern.find({})
    res.send(patterns)
  }
  catch (error) {
    console.warn(error)
    res.status(500)
    res.send({ error })
  }
}

export async function getPattern (req, res) {
  try {
    const pattern = await Pattern.findById(req.params.id)
    if (pattern === null) { res.status(404).send() }
    else { res.status(200).send(pattern) }
  }
  catch (error) { res.status(500).send({ error }) }
}

export async function deletePatterns (req, res) {
  try {
    const pattern = await Pattern.findByIdAndDelete(req.params.id)
    if (pattern === null) { res.status(404).send() }
    else { res.status(200).send(pattern) }
  }
  catch (error) {
    console.warn(error)
    res.status(500).send({ error })
  }
}

export async function updatePattern (req, res) {
  try {
    const pattern = await Pattern.findByIdAndUpdate(req.params.id, req.body)
    if (pattern === null) { res.status(404).send() }
    res.status(200).send(pattern)
  }
  catch (error) {
    console.warn(error)
    res.status(500).send(error)
  }
}

export async function getPatternPDF (req, res) {
  try {
    // TODO handle errors more precisely
    const pattern = await Pattern.findById(req.params.id)
    if (pattern === null) { res.status(404).send() }
    // eslint-disable-next-line no-unused-vars
    const { size } = req.query
    const data = '' // extraction.findDataBySize(pattern, size)

    // send data
    const buffers = []
    data.on('data', (chunk) => {
      console.log('Chuck DATA', chunk)
      buffers.push(chunk)
    })
    data.on('end', () => {
      const filePdf = Buffer.concat(buffers)
      res.set('Content-Type', 'application/pdf')
        .status(200)
        .send(filePdf)
    })
  }
  catch (error) {
    console.warn(error)
    res.status(500).send(error)
  }
}
