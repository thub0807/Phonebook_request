
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url =
`mongodb+srv://phonebook:${password}@cluster0.qb2urue.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`



mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Persons = mongoose.model('persons', personSchema)
  
  const person = new Persons({
    name: name,
    number: number,
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











// const { MongoClient, ServerApiVersion } = require('mongodb');

// // const password = "1114104133";

// const password = process.argv[2]

// const url =
//   `mongodb+srv://phonebook:${password}@cluster0.qb2urue.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(url, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     note.save().then(result => {
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     })
    
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
