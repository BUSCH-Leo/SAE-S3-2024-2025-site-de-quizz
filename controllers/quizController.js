const MyQuiz = require('../models/project');

exports.createQuiz = async (req, res) => {
    try {
        const quiz = new MyQuiz(req.body);
        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await MyQuiz.find().populate('creator', 'username email');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await MyQuiz.findById(req.params.id).populate('creator', 'username email');
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz non trouvé' });
        }
        res.json(quiz);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID invalide' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.updateQuizById = async (req, res) => {
    try {
        const quiz = await MyQuiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz non trouvé' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteQuizById = async (req, res) => {
    try {
        const quiz = await MyQuiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz non trouvé' });
        }
        res.json({ message: 'Quiz supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};