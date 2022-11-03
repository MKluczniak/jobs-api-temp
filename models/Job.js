const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required: [true, "must provide company"],
        maxlength:50
    },
    position:{
        type:String,
        required: [true, "must provide position"],
        maxlength:50
    },
    status:{
        type:String,
        required: [true, "must provide company"],
        enum: ['interview', 'declined', 'pending'], //enum, values that are only possible to chose 
        default: 'pending'
    },
    createdBy:{   //we are tying job model to the user one, so we have model over in the schemas (UserSchema), every time we create a job we will asign it to one of the users, and as a result our functionality will work bc every job u create will be associated with the user
        type: mongoose.Types.ObjectId,
        ref:'User', //ref means which model we referencing
        required:[true, 'Please provide user'] //bc we dont want to create a job without the user
    }
}, {timestamps:true}) //lastly right after the schema obj., (the first option we have here i wanna go with coma, timesstamp ) (it has benefit to use tampstamps)

module.exports = mongoose.model('Job', JobSchema)


//now as we have it all done, we can focues on routes, lets start with create one 