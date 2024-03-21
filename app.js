const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/mongo.js')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
  Person.find().then(result => res.send(`phonebook has data for ${result.length} people<br/>${Date()}`))
})

app.get('/api/persons', (req, res) => {
  Person.find().then(result => res.json(result))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findOne({ _id: req.params.id })
    .then(result => result ? res.json(result) : res.status(404).end())
    .catch(err => next(err))
})

app.post('/api/persons', async (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    next({ message: 'missing info' })
  } else if (await Person.findOne({ name: req.body.name })) {
    next({ message: 'name must be unique' })
  } else {
    const newPerson = new Person({
      name: req.body.name,
      number: req.body.number,
    })
    newPerson.save().then(result => res.status(201).json(newPerson)).catch(err => next(err))
  }
})

app.put('/api/persons/:id', (req, res) => {
  Person.findByIdAndUpdate(req.params.id, { name: req.body.name, number: req.body.number }, { new: true, runValidators: true, context: 'query' }).then(result => res.json(result))
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findOneAndDelete(req.params.id).then(result => res.status(204).end())
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else {
    return response.status(404).json({ error: error.message })
  }
}

app.use(errorHandler)

app.listen(process.env.PORT || 3000, console.log(`listening on :${process.env.PORT || 3000}`))
