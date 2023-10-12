import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
    taskname : {
        type : String,
        required : true,
    },
    deadline : {
        type : Date,
        required : true
    },
    status : {
        type : Boolean,
        required : true,
        default : false
    },
    reminders : {
        type : [Date],
        required : true
    }
});

const tasksModel = new mongoose.model("Tasks", tasksSchema, "tasks");

export default tasksModel;