const express = require('express')
const app = express()

app.use(express.json())

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
    response.send(`Phonebook has info for ${peopleAmount()} people <br> yay ${Date()}`) // \r\n to have space
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})