
const express = require('express')
const app = express()
require('dotenv').config()



// 后台输出morgan日志
var morgan = require('morgan')

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);

})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


const Person = require('./models/note')

// 跨域http://localhost:5173前端获取后端 http://localhost:3001/api/persons 数据
const cors = require('cors')
app.use(cors())

let notes = 
  [
]
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')  
  next()
}

// 使用body-parser中间件解析post request
app.use(express.json())
app.use(requestLogger)


// 未知错误处理
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!20245.5</h1>')
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      persons.map(person => person)
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
    })
    
  })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person =>{
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    }).catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(result =>{
      response.status(204).end()      
    }).catch(error => next(error))

  })

  // 随机生成id  
const generateId = () => {
    // const maxId = notes.length > 0
    //   ? Math.max(...notes.map(n => n.id))
    //   : 0
    const id = Math.floor(Math.random() * 1000000)
    if (IDisvaild(id)){
      return id
    }else{
      return generateId()
    }  
  }
const IDisvaild = (id) =>{
    Person.find({}).then(result => {
      result.forEach(item =>{
        if(item.id === id){
          return false
        }
        return true
      })    
    })
  }
    
  

// post请求添加数据，需要body-parser中间件 request.body获取post请求的数据
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: ' The name or number is missing' 
      })
    }
    Person.find({}).then(result => {
        result.forEach(item =>{
          if (item.name === body.name) {
            return response.status(400).json({ 
              error: '  The name must be unique' 
            })
          }
        })
      })
    const note = new Person({
      name: body.name,
      number: body.number,  
      important: Math.random() < 0.5,                
    })
    
    note.save()
    .then(savedNote => savedNote)
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson);
    })
    .catch(error => {
      return response.status(400).json({
        error: "name must be unique"
      });
    });
  })
  app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;
  
    const person = {
      name: body.name,
      number: body.number
    };
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson);
      })
      .catch(error => next(error));
  });

 
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})