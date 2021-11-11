const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { "id": 1, "name": "Arto Hellas", "number": "040-123456" },
  { "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
  { "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
  { "id": 4, "name": "Mary Poppendick", "number": "39-23-6423122" }
]

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people <br>${new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(new Date())}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  return Math.round(Math.random() * (999999999 - 111111111) + 111111111)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name){
    res.status(400).json({
      error: "Required paremeter 'name' is missing"
    })
  }

  if (!body.number){
    res.status(400).json({
      error: "Required paremeter 'number' is missing"
    })
  }

  const name = body.name

  if (persons.find(person => person.name === name)){
    res.status(400).json({
      error: `Person '${name}' already exists in phonebook!`
    })
  }

  const number = body.number
  const id = generateId()
  const newPerson = {"id": id, "name": name, "number": number}
  persons = persons.concat(newPerson)
  res.json(newPerson)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})