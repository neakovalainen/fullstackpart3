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

let persons = []

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)  
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/api/info', (request, response) => {
    response.send(`Phonebook has info for ${peopleAmount()} people <br> yay ${Date()}`)
}) 

const peopleAmount = () => {
    const biggestId = persons.length > 0 
        ? Math.max(...persons.map(person => Number(person.id)))
        : 0
    return String(biggestId)

}

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)  
    }
    else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newId = () => {
        const rndm = Math.round(Math.random() * 2000)
        return String(rndm)
    } 
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
    if (persons.find((person) => person.name === body.name)) {
        return response.status(400).json({
            error: 'the person is already there u dum dum'
        })
    }
    const person = new Person({
        id: `${newId()}`,
        name: body.name,
        number: body.number || false,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})