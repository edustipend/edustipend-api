const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  author: {
    // will be modified to use user IDs. For now, we will use emails and names
    type: String,
    required: true
  },
  // no need to use timestamps, because comments should not be updated
  // instead, new comments can be made
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  createdBy: {
    // to subsequently be modified to use user IDs
    // this is just a prototype to check if it makes our customer support workflow easier for us
    // it uses emails for now
    type: String,
    required: true
  },
  assignedTo: {
    // subsequently, we can have people to assign problems of a specific nature to
    // user IDs will be used in the future
    // For now, we will use full names
    type: String,
  },
  comments: [commentSchema]
}, {
  timestamps: true
})

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket;