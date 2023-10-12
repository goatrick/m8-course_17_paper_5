import express from "express";
import { body, validationResult, param } from "express-validator";

const router = express.Router();

import TasksModel from "../models/TasksModel.js";

/*
    API Endpoint : /api/tasks
    HTTP Method : GET
    Data Validations  : None 
    Desc : Read all the tasks from the DB and send the data as response
*/
router.get("/", async (req, res) => {
    try {
        const tasks = await TasksModel.find({}, "-__v");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/*
    API Endpoint : /api/task
    HTTP Method : GET
    Params : _id
    Data Validations  : None 
    Desc : Read all the tasks from data.json and send the _id task as response
*/
router.get("/:taskid",
    param("taskid").isMongoId().withMessage("The TaskID Param must be Mongo Object ID"),
    async (req, res) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            const task = await TasksModel.findById(req.params.taskid, "-__v");
            if (task) res.status(200).json(task)
            else res.status(200).json({ message: "Invalid Task ID" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

/*
    API Endpoint : /api/tasks/add
    HTTP Method : POST
    Data Validations  : {taskname,  deadline , status}
    Desc : Inserting new task into the DB
*/
router.post("/add",
    body("taskname").isLength({ min: 6 }).withMessage("TaskName Must be 6 Characters"),
    body("deadline").custom((deadline, { req }) => {
        //Verify deadline
        if (isNaN(Date.parse(deadline))) {
            return false;
        }
        let liveTime = new Date(); //Live Time
        let inputTime = new Date(deadline); //Input Time in UTC+0000

        let diff_in_milliseconds = inputTime - liveTime;
        let diff_in_minutes = diff_in_milliseconds / (1000 * 60);
        let diff_in_days = diff_in_milliseconds / (1000 * 60 * 60 * 24);

        if (diff_in_minutes < 15 || diff_in_days > 30) {
            return false;
        }
        return true;
    }).withMessage("Deadline cannot be backdated & within next 15 mins & must be within 30 Days"),
    async (req, res) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            let taskData = new TasksModel(req.body);
            // taskData.status = false;
            //Create 3 Reminders 
            taskData.reminders = [];
            let currentTime = new Date();
            // console.log("Deadline is : ", taskData.deadline);
            // console.log("Current Timestamp : ", currentTime);
            let timeDiff = (taskData.deadline - currentTime);
            let ms = new Date().getTime(); //realtime ms 
            // console.log(timeDiff);//diff in ms
            taskData.reminders.push(new Date(ms + timeDiff * (1 / 4)));//1/4
            taskData.reminders.push(new Date(ms + timeDiff * (1 / 2)));// 1/2
            taskData.reminders.push(new Date(ms + timeDiff * (3 / 4)));// 3/4

            // console.log(taskData);
            await taskData.save(); //Saves the data into DB
            res.status(200).json({ message: "Task has been added successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
//Note : Make sure the custom middleware is return boolean true/false


/*
    API Endpoint : /api/tasks/edit
    HTTP Method : PUT
    Data Validations  : {taskname,  deadline , status}
    Params : :taskid
    Desc : Edits a particular task id from the DB


*/
router.put("/edit/:taskid",
    body("taskname").isLength({ min: 6 }).withMessage("TaskName Must be 6 Characters"),
    body("status").isBoolean().withMessage("Status Must Be a Boolean"),
    body("deadline").custom((deadline, { req }) => {
        if (req.body.status) {
            return true;
        }
        //Verify deadline
        if (isNaN(Date.parse(deadline))) {
            return false;
        }
        let liveTime = new Date(); //Live Time
        let inputTime = new Date(deadline); //Input Time in UTC+0000

        let diff_in_milliseconds = inputTime - liveTime;
        let diff_in_minutes = diff_in_milliseconds / (1000 * 60);
        let diff_in_days = diff_in_milliseconds / (1000 * 60 * 60 * 24);

        if (diff_in_minutes < 15 || diff_in_days > 30) {
            return false;
        }
        return true;
    }).withMessage("Deadline cannot be backdated & within next 15 mins & must be within 30 Days"),
    param("taskid").isMongoId().withMessage("The TaskID Param must be Mongo Object ID"),
    async (req, res) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            let taskUpdated = await TasksModel.findByIdAndUpdate(req.params.taskid, req.body);
            if (!taskUpdated) return res.status(400).json({ message: "Invalid TaskID" });
            res.status(200).json({ message: "Task has been Updated in DB successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

/*
    API Endpoint : /api/tasks/delete/:taskid
    HTTP Method : DELETE
    Data Validations  : None
    Params : :taskid
    Desc : Deletes a particular task id from the DB
*/
router.delete("/delete/:taskid",
    param("taskid").isMongoId().withMessage("The TaskID Param must be Mongo Object ID"),
    async (req, res) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            let taskid = req.params.taskid;
            const deletedTask = await TasksModel.findByIdAndDelete(taskid);
            if (deletedTask) return res.status(200).json({ message: "Task has been Deleted in DB successfully" });
            res.status(200).json({ message: "TaskId is Invalid" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

export default router;