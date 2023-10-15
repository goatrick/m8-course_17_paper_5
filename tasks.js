import mongoose from 'mongoose';
import fs from 'fs/promises';

const atlas_server_info = "mongodb+srv://goatricky:new12345@cs22.bj0qyig.mongodb.net";
const database_name = "mock-data";

async function connectDB() {
    try {
        await mongoose.connect(`${atlas_server_info}/${database_name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongo DB Connected");
    } catch (error) {
        console.error(error);
    }
}

connectDB();

const taskSchema = new mongoose.Schema({
    taskId: String,
    taskName: String,
    deadline: Date,
    taskStatus: String,
});

const Task = mongoose.model('Task', taskSchema);

async function readDataAndAppendToFile() {
    try {
        // Read all data from the MongoDB collection
        const data = await Task.find({}).exec();

        // Write the data to the logs.json file
        await fs.writeFile('logs.json', JSON.stringify(data, null, 2));

        console.log('Data appended to logs.json');
    } catch (error) {
        console.error('Error reading data from MongoDB or writing to the file:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
    }
}

// Call the function to start the process
readDataAndAppendToFile();
