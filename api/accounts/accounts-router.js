const router = require('express').Router()
const Accounts = require('./accounts-model')
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
} = require('./accounts-middleware')

router.get('/', (req, res, next) => {
  Accounts.getAll()
  .then(accounts => res.json(accounts))
  .catch(err => res.json(err.message))
  next()
})

router.get('/:id', checkAccountId, (req, res, next) => {
  Accounts.getById(req.params.id)
  .then(account => res.json(account))
  .catch(err => res.json(err.message))
  next()
})

router.post('/', checkAccountPayload, checkAccountNameUnique, (req, res, next) => {
  const newAccount = {
    name: req.body.name,
    budget: req.body.budget.trim()
  }
  Accounts.create(newAccount)
  .then(account => res.json(account))
  .catch(err => res.json(err.message))
  next()
})

router.put('/:id', checkAccountPayload, checkAccountId, (req, res, next) => {
  const updateAccount = {
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget.trim()
  }
  Accounts.updateById(updateAccount)
  .then(account => res.json(account))
  .catch(err => res.json(err.message))
  next()
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  const deleteAccount = await Accounts.getById(req.params.id)
  Accounts.deleteById(req.params.id)
  .then(() => res.json(deleteAccount))
  .catch(err => res.json(err.message))
  next()
})

router.use('*', (err, req, res, next) => { // eslint-disable-line
  res.status(404).json({message: 'request not found'})
})

module.exports = router;