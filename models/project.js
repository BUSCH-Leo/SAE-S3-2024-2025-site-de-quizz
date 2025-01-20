const mongoose = require('mongoose');

const AnswerOptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
});

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple', 'truefalse', 'price', 'standart'],
        required: true
    },
    mediaUrl: {
        type: String,
        default: ''
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', ''],
        default: ''
    },
    timeLimit: {
        type: Number,
        default: 30,
        min: 10,
        max: 120
    },
    points: {
        type: Number,
        default: 10,
        min: 0
    },
    answerOptions: {
        type: [AnswerOptionSchema],
        validate: [
            {
                validator: function(options) {
                    if (this.type === 'standart') {
                        return options.filter(opt => opt.isCorrect).length === 1;
                    }
                    return true;
                },
                message: 'Les questions standards doivent avoir exactement une bonne réponse'
            },
            {
                validator: function(options) {
                    if (this.type === 'multiple') {
                        return options.filter(opt => opt.isCorrect).length >= 2;
                    }
                    return true;
                },
                message: 'Les questions à réponses multiples doivent avoir au moins deux bonnes réponses'
            }
        ]
    },
    correctPrice: {
        type: Number,
        required: function() {
            return this.type === 'price';
        }
    },
    correctAnswer: {
        type: Boolean,
        required: function() {
            return this.type === 'truefalse';
        }
    }
});

QuestionSchema.pre('save', function(next) {
    switch (this.type) {
        case 'standart':
            if (!this.answerOptions || this.answerOptions.length < 2) {
                return next(new Error('Les questions standards doivent avoir au moins deux options'));
            }

            const correctAnswersStandard = this.answerOptions.filter(opt => opt.isCorrect).length;
            if (correctAnswersStandard !== 1) {
                return next(new Error('Les questions standards doivent avoir exactement une bonne réponse'));
            }
            break;

        case 'multiple':
            if (!this.answerOptions || this.answerOptions.length < 3) {
                return next(new Error('Les questions à réponses multiples doivent avoir au moins trois options'));
            }
            const correctAnswersMultiple = this.answerOptions.filter(opt => opt.isCorrect).length;
            if (correctAnswersMultiple < 2) {
                return next(new Error('Les questions à réponses multiples doivent avoir au moins deux bonnes réponses'));
            }
            break;

        case 'price':
            if (this.correctPrice === undefined) {
                return next(new Error('Les questions de type juste prix doivent avoir un prix correct'));
            }
            break;

        case 'truefalse':
            if (this.correctAnswer === undefined) {
                return next(new Error('Les questions vrai/faux doivent avoir une réponse définie'));
            }
            break;
    }
    next();
});

const MyQuizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    theme: {
        type: String,
        default: 'standart'
    },
    font: {
        type: String,
        default: 'Arial'
    },
    enableTimeBonus: {
        type: Boolean,
        default: false
    },
    questions: [QuestionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
});

MyQuizSchema.pre('save', function(next) {
    this.lastModified = Date.now();
    next();
});

module.exports = mongoose.model('MyQuiz', MyQuizSchema);
