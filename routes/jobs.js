



const express = require('express')
const { getAlljobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs')

const router = express.Router()







router.route("/").post(createJob).get(getAlljobs)
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob)







module.exports = router




// router.get("/",getAlljobs)

// router.get("/",getJob)
// router.post("/",createJob)
// router.patch("/",updateJob)
// router.delete("/",deleteJob)