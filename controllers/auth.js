const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
// const bcrypt = require('bcryptjs')    //bcryptjs not bcryptjs bez js :P
// const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    // const {name, email, password} = req.body

    // const salt = await bcrypt.genSalt(10)   //10 is considered as standard and it is already a very strong pass, if we do more it is also resources consuming
    // const hashedPassword = await bcrypt.hash(password, salt)

    // const tempUser = {name, email, password: hashedPassword}   // co to jest za syntax z tym :

    // if (!name ||!email || !password ){
    //     throw new BadRequestError('provide name, email and pass')
    // }

    const user = await User.create( {...req.body })       //User.create({...req.body})
    // const token = jwt.sign({userId: user._id, name: user.name}, 'jwtSecret', {expiresIn: '30d'})   //user you are getting one line above, you can check in the posman what we are curently sending back
    
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})    // us can send back to token, but u can also send the name, or whaterver some set ups even lts the frontend decode the token... so many ways 
}


const login = async (req, res) =>{    
    const {email, password} = req.body

    if(!email || !password)
        throw new BadRequestError('please provide name and password') 

    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }


  
    const token = user.createJWT()
    // res.status(StatusCodes.OK).json({user:{name:user.name}, token}) //error    in postman:"code": "ERR_HTTP_INVALID_STATUS_CODE"
    res.status(StatusCodes.OK).json({ user:{ name: user.name }, token }) //no error

}




module.exports = {login, register}



//zapomniales async