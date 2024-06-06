const mongoose = require('mongoose')

const Schema = mongoose.Schema

const assignmentSchema = new Schema({
    title: String,
    author: String,
    hours: String,
    body: String,
    location: String,
    rates: String,
    gender: String,
}, {timestamps: true})

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

