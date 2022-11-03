const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')



const getAlljobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
  }


// const getAlljobs = async (req, res) => {   //remeber we want all jobs but asoccieted with the user
//     const jobs = await Job.find({createdBt:req.user.userId}).sort('createdAt')   //that user propery is going to be on every requrest since in app.js we placed our middleware in front of all of our jobs routes 
//     res.status(StatusCodes.OK).json({jobs, count: jobs.length})
//     res.send("get all jobs")

// }

const getJob = async (req, res) => {
    const {
      user: { userId },   //nested distructureing    //the params id is ofcoured what we set up in app.js with the route jobs/:id, and i right away give it an alias of jobId
      params: { id: jobId },
    } = req
  
    const job = await Job.findOne({
      _id: jobId,
      createdBy: userId,
    })
    console.log(jobId, userId)
    if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
  }


const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId    // 'its located in req.user.userId and the propery name is userId'
    const job = await Job.create(req.body)    //validations go on and if everything correct we have a job
    // res.send(req.body) not removing cozed the only some parts got sended, the next line got ommited and the response in postman was not as the model dictates and the error of soure was cannot set headers after they are sent to the client
    res.status(StatusCodes.CREATED).json({job})
} 
const updateJob = async (req, res) => {
    const {
        body:{company, position},
        user: { userId },   
        params: { id: jobId },
      } = req

      if(company === '', position === ' '){
        throw new BadRequestError('company and position can not be empty')
      }
      const job = await Job.findByIdAndUpdate(
        {_id: jobId, createdBy: userId},
        req.body, 
        {new: true, runValidators: true}
      )
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).json({ job })
  
}
const deleteJob = async (req, res) => {
    const {   //on more remider one is coming from the authmiddleware, and second from params
        body:{company, position},
        user: { userId },   
        params: { id: jobId },
      } = req

      const job = await Job.findOneAndRemove({_id:jobId, createdBy: userId})
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).send() //a llot depends on front end but we just send 200

}




module.exports = {getAlljobs, getJob, createJob, updateJob, deleteJob }



//zapomniales async