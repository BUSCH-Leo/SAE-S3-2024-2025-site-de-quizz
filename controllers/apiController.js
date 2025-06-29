const Category = require('../models/category');
const Quiz = require('../models/quizz');
const MyQuiz = require('../models/project');
const { invalidateCache } = require('../middleware/cache');
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
};

const getQuizzesByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const quizzes = await Quiz.find({ category: categoryId }).limit(10);
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: 'Aucun quiz disponible pour cette catégorie' });
        }
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getQuickQuizzes = async (req, res) => {
    const { count, difficulty } = req.query;
    try {
        const quizzes = await Quiz.find({ 'questions.difficulty': difficulty })
            .limit(parseInt(count, 10));
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: 'Aucun quiz disponible pour cette sélection' });
        }
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des quizzes' });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await MyQuiz.find({ creator: req.user._id })
            .select('name createdAt lastModified')
            .sort({ lastModified: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
    }
};
// Fonction pour invalider le cache lors des modifications
/*const invalidateQuizCache = async () => {
    try {
        await invalidateCache('cache:/api/quiz/*');
        await invalidateCache('cache:/api/categories*');
    } catch (error) {
        console.error('Erreur invalidation cache:', error);
    }
};
*/

module.exports = {
    getCategories,
    getQuizzesByCategory,
    getQuickQuizzes,
    getProjects,
    //invalidateQuizCache
};