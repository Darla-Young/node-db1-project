const router = require('express').Router()
const Accounts = require('./accounts-model')
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
} = require('./accounts-middleware')

router.get('/', (req, res) => {
  Accounts.getAll()
  .then(accounts => res.json(accounts))
  .catch(err => res.json(err.message))
})

router.get('/:id', checkAccountId, (req, res) => {
  Accounts.getById(req.params.id)
  .then(account => res.json(account))
  .catch(err => res.json(err.message))
})

router.post('/',checkAccountPayload, checkAccountNameUnique, (req, res) => {
  const newAccount = {
    name: req.body.name.trim(),
    budget: req.body.budget
  }
  Accounts.create(newAccount)
  .then(account => res.status(201).json(account))
  .catch(err => res.json(err.message))
})

router.put('/:id', checkAccountPayload, checkAccountId, (req, res) => {
  const updateAccount = {
    name: req.body.name.trim(),
    budget: req.body.budget
  }
  Accounts.updateById(req.params.id, updateAccount)
  .then(account => res.json(account))
  .catch(err => res.json(err.message))
});

router.delete('/:id', checkAccountId, async (req, res) => {
  const deleteAccount = await Accounts.getById(req.params.id)
  Accounts.deleteById(req.params.id)
  .then(() => res.json(deleteAccount))
  .catch(err => res.json(err.message))
})

router.use('*', (err, req, res, next) => { // eslint-disable-line
  res.status(404).json({message: 'request not found'})
})

module.exports = router;