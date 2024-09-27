// models/quizz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  questions: [{
    type: {
      type: String
    },
    difficulty: {
      type: String
    },
    question: {
      type: String,
      required: true
    },
    correct_answer: {
      type: String,
      required: true
    },
    incorrect_answers: [{
      type: String
    }]
  }]
});

module.exports = mongoose.model('Quiz', quizSchema);
