const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    const person = {
        id: `${newId()}`,
        name: body.name,
        number: body.number || false,
    }

    persons = persons.concat(person)
    response.json(request.body)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})