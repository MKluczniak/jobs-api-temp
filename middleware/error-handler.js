// const { CustomAPIError } = require('../errors')  // 195.
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)

  let customError = {
    //set default
    statusCode: err.statusCose || StatusCodes.INTERNAL_SERVER_ERROR, msg:err.message || 'Something went wrong try again later'
  } 

//we can remove it bc we deal with that (with status code and message (195. custom error lesson))
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    console.log(Object.values(err.errors)) //you can clearly see you are getting the arry of obj. 
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }


  if(err.code && err.code === 11000)
  {
    customError.msg = `duplicate value entered for ${Object.keys(err.keyValue)}field , please choose another value`
    customError.statusCode = 400
  }

  if (err.name === 'CastError'){
    customError.msg = `No item found with id: err ${err.value}` //miales custom.Err, a ma byv bez .
    customError.statusCode = 404
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })  //sending generic response, and passing in the obj. (err)
  return res.status(customError.statusCode).json({msg: customError.msg})
  }

module.exports = errorHandlerMiddleware
