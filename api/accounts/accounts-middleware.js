const db = require('../../data/db-config')

exports.checkAccountPayload = (req, res, next) => {
  if (!req.body.name || !req.body.budget) {
    res.status(400).json({ message: "name and budget are required and budget must be a number" })
  }
  else if (req.body.name.trim().length < 3 || req.body.name.trim().length > 100) {
    res.status(400).json({ message: "name of account must be between 3 and 100" })
  }
  else if (parseFloat(req.body.budget) !== req.body.budget) {
    res.status(400).json({ message: "budget of account must be a number" })
  }
  else if (req.body.budget < 0 || req.body.budget > 1000000) {
    res.status(400).json({ message: "budget of account is too large or too small" })
  }
  else next()
}

exports.checkAccountNameUnique = async (req, res, next) => {
  const existing = await db('accounts').where('name', req.body.name.trim())
  if (existing.length > 0) {
    res.status(400).json({ message: "that name is taken" })
  }
  else next()
}

exports.checkAccountId = (req, res, next) => {
  db('accounts').where('id', req.params.id)
  .then(account => {
    if (account.length === 0) res.status(404).json({ message: "account not found" })
    else next()
  })
}
