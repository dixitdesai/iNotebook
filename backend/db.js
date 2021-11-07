const mongoose = require('mongoose');

const MONGOURL = "mongodb://localhost:27017/inotebook"

const connectToMongo = () => {
    mongoose.connect(MONGOURL, () => {
        console.log("Connected to Mongo Successfully!");
    })
}

module.exports = connectToMongo;