const express = require('express')
const app = express()



// 后台输出morgan日志
var morgan = require('morgan')

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);

})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


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
// app.use(requestLogger)


// 未知错误处理
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!20245.5</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${notes.length} people</p>
    <p>${new Date()}</p>`)
  })

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
  
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end() 
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
    if(notes.find(note => note.id === id)){
        return false
    }
    return true
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
    if (notes.find(note => note.name === body.name)) {
      return response.status(400).json({ 
        error: '  The name must be unique' 
      })
    }
  
    const note = {
      id: generateId(),
      name: body.name,
      number: body.number,                  
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

 
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})