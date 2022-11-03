const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')    // ??? dlaczego tutaj w {} a w User bez



const auth = async (req, res, next) => {
    //check header 
    // const authHeader = req.body.authorization  miales blad body != headers :P dlatego nie przechodzila authoryzacja
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Auth invaliddd')
    }
const token = authHeader.split(' ')[1]

try{
    const payload = jwt.verify(token, process.env.JWT_SECRET )
    //attach the user to the job routes]

    // const user User.find   // you can make a alernative set up with finding user in the db (lesson 186)


    req.user = {userId:payload.userId, name:payload.name}
    next()  // we pass along the user to the job routes 


}catch(error){
    throw new UnauthenticatedError('Auth invalid')
}


}


module.exports = auth
