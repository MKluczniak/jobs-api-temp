const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],  //checks if matches go regural expresion
    unique: true,  // it creted uniqe index, this doesnt validate just checks if email is there, and will giv dup error msg, imp when authomatic testing
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    //   maxlength: 15 removing when hashed passowed
  },
})

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}
//now in the auth.js once we create a user we can just call the method createJWT     in auth.js--> const token = user.createJWT()


UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}








//demonstration purposes how to create new method on user
// UserSchema.methods.getName = function() {   /// WE WANT TO USE THE FUNCTION KEY WORD THAT WAY "THIS" WILL POINT TO OUR DOCUMENT
// return this.name

// }


module.exports = mongoose.model('User', UserSchema)