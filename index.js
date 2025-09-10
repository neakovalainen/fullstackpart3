require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
//has to be body, because it's returned by app.post and it's a predefined in express!!
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(
      `<p>
              Phonebook has info for ${people.length} people
              <br>
              and the date is ${Date()}
          </p>`)
  })
})

// hoitaa tyypin poistamisen tietokannasta
app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params)
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      console.log(request.params.id, 'id?')
      response.status(204).end()
    })
    .catch(error => {
      console.log(request.params.id, 'id?')
      /* console.log(error) */
      next(error)
    })
})

// hoitaa uuden tyypin lisäämisen tietokantaan
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'oh noo!! name is missing...'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'you forgot the number right?'
    })
  }
  /*if (persons.find((person) => person.name === body.name)) {
      return response.status(400).json({
          error: 'the person is already there u dum dum'
      })*/

  //uusi ihminen (model, parametrien perusteella luotu js olio)
  const person = new Person({
    name: body.name,
    number: body.number || false,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  Person.updateOne({
    name: body.name },
  { $set: {
    number: body.number
  }

  })
    .then(result => {
      (console.log('changed?', request.body))
      response.json(result)
    })
    .catch(error => {
      next(error)
    })


})
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)

}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})