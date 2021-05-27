import User from '../models/User.js'
import Pattern from '../models/Pattern.js'

export async function getUserPatterns (req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      const patterns = await Pattern.find({ creator: req.params.id })
      res.status(200).send(patterns)
    }
    else { res.status(404).send() }
  }
  catch (error) {
    console.warn(error)
    res.status(500).send()
  }
}

export async function getUserById (req, res) {
  try {
    const { id } = req.params
    const result = await User.findById(id)
      .catch(() => { res.status(400).send() })
    if (!result) { res.status(404).send() }
    else { res.status(200).send(result) }
  }
  catch (error) {
    console.warn(error)
    res.send(500)
  }
}
