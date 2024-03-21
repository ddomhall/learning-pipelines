const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
async function connect() {
  // eslint-disable-next-line no-console
  console.log('connecting to', url)
  mongoose.set('strictQuery',false)
  // eslint-disable-next-line no-console
  await mongoose.connect(url).catch(error => console.log('error connecting to MongoDB:', error.message))
  // eslint-disable-next-line no-console
  console.log('connected to MongoDB')
}

module.exports = mongoose.model('Person', new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d*$/.test(v)
      }
    }
  }
}).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
  }
}))

connect()

