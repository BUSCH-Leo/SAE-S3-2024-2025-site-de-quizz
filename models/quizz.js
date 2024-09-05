const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['multiple', 'boolean'], 
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'], 
        required: true,
    },
    category: {
        type: String, 
        required: true,
    },
    question: {
        type: String, 
        required: true,
    },
    correct_answer: {
        type: String,
        required: true,
    },
    incorrect_answers: [
        {
            type: String,
            required: true,
        }
    ],
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    questions: [questionSchema], 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
