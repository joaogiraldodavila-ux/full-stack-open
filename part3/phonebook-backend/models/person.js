const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
// Obtenemos la URL de la base de datos desde las variables de entorno
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    required: [true, 'El nombre es obligatorio']
  },
  number: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    minlength: [8, 'El número de teléfono debe tener al menos 8 caracteres'],
    validate: {
    validator: function(v) {
      // Valida que tenga la estructura: 2-3 dígitos, un guion, y luego más dígitos
      return /^\d{2,3}-\d+$/.test(v);
    },
    message: props => `${props.value} no es un número de teléfono válido. Debe tener el formato XX-YYYYYY o XXX-YYYYYY.`
  }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)