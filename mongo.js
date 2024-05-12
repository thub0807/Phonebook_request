
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
// const name = process.argv[3]
// const number = process.argv[4]

const name = "aaaa"
const number ="1111"


const url =
`mongodb+srv://phonebook:${password}@cluster0.qb2urue.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`



mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
        },
    number: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    important: Boolean,
  })
  
  const Persons = mongoose.model('persons', personSchema)
  
  const person = new Persons({
    id: Math.floor(Math.random() * 1000),
    name: name,
    number: number,
    important: true,
  })

  if(name !== undefined&&number!==undefined){
    person.save().then(result => {
        console.log(`added ${name} number: ${number} to phonebook`)
        mongoose.connection.close()
      })
  }else{
    Persons.find({}).then(result => {
        result.forEach(item =>{
            console.log(item.name+"  "+item.number)
          })
        
        mongoose.connection.close()
      })
    }

})











