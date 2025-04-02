const express = require('express');
const router = express.Router();
const Potion = require('./potion.model');
const authMiddleware = require('./auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Potions
 *   description: Gestion des potions magiques
 */

/**
 * @swagger
 * /potions:
 *   get:
 *     summary: Liste toutes les potions
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: Liste des potions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Potion'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', async (req, res) => {
    try {
        const potions = await Potion.find();
        res.json(potions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions:
 *   post:
 *     summary: Crée une nouvelle potion (authentification requise)
 *     tags: [Potions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Potion'
 *     responses:
 *       201:
 *         description: Potion créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Potion'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newPotion = new Potion(req.body);
        const savedPotion = await newPotion.save();
        res.status(201).json(savedPotion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/names:
 *   get:
 *     summary: Liste tous les noms de potions
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: Liste des noms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/names', async (req, res) => {
    try {
        const names = await Potion.find({}, 'name');
        res.json(names.map(p => p.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/vendor/{vendor_id}:
 *   get:
 *     summary: Liste les potions d'un vendeur
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vendeur
 *     responses:
 *       200:
 *         description: Liste des potions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Potion'
 *       500:
 *         description: Erreur serveur
 */
router.get('/vendor/:vendor_id', async (req, res) => {
    try {
        const potions = await Potion.find({ vendor: req.params.vendor_id });
        res.json(potions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/price-range:
 *   get:
 *     summary: Liste les potions dans une fourchette de prix
 *     tags: [Potions]
 *     parameters:
 *       - in: query
 *         name: min
 *         required: true
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: max
 *         required: true
 *         schema:
 *           type: number
 *         description: Prix maximum
 *     responses:
 *       200:
 *         description: Liste des potions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Potion'
 *       500:
 *         description: Erreur serveur
 */
router.get('/price-range', async (req, res) => {
    const { min, max } = req.query;
    try {
        const potions = await Potion.find({
            price: { $gte: min, $lte: max }
        });
        res.json(potions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/analytics/distinct-categories:
 *   get:
 *     summary: Nombre de catégories distinctes
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: Nombre de catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_categories:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get('/analytics/distinct-categories', async (req, res) => {
    try {
        const categories = await Potion.distinct('category');
        res.json({ total_categories: categories.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/analytics/average-score-by-vendor:
 *   get:
 *     summary: Score moyen par vendeur
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: Scores moyens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   averageScore:
 *                     type: number
 *       500:
 *         description: Erreur serveur
 */
router.get('/analytics/average-score-by-vendor', async (req, res) => {
    try {
        const result = await Potion.aggregate([
            { $group: { _id: "$vendor", averageScore: { $avg: "$score" } } }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/analytics/average-score-by-category:
 *   get:
 *     summary: Score moyen par catégorie
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: Scores moyens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   averageScore:
 *                     type: number
 *       500:
 *         description: Erreur serveur
 */
router.get('/analytics/average-score-by-category', async (req, res) => {
    try {
        const result = await Potion.aggregate([
            { $group: { _id: "$category", averageScore: { $avg: "$score" } } }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/analytics/strength-flavor-ratio:
 *   get:
 *     summary: Ratio force/parfum des potions
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: Ratios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   strengthFlavorRatio:
 *                     type: number
 *       500:
 *         description: Erreur serveur
 */
router.get('/analytics/strength-flavor-ratio', async (req, res) => {
    try {
        const result = await Potion.aggregate([
            {
                $project: {
                    strengthFlavorRatio: { $divide: ["$strength", "$flavor"] }
                }
            }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/analytics/search:
 *   get:
 *     summary: Recherche analytique
 *     tags: [Potions]
 *     parameters:
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *         description: Champ de regroupement (vendor/category)
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *         description: Métrique (avg/sum/count)
 *       - in: query
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *         description: Champ à analyser (score/price/ratings)
 *     responses:
 *       200:
 *         description: Résultats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   [metric]:
 *                     type: number
 *       500:
 *         description: Erreur serveur
 */
router.get('/analytics/search', async (req, res) => {
    const { groupBy, metric, field } = req.query;

    let aggregation = [
        {
            $group: {
                _id: `$${groupBy}`,
                [metric]: { [`$${metric}`]: `$${field}` }
            }
        }
    ];

    try {
        const result = await Potion.aggregate(aggregation);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/{id}:
 *   get:
 *     summary: Récupère une potion par son ID
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la potion
 *     responses:
 *       200:
 *         description: Potion trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Potion'
 *       404:
 *         description: Potion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', async (req, res) => {
    try {
        const potion = await Potion.findById(req.params.id);
        if (!potion) return res.status(404).json({ error: 'Potion non trouvée' });
        res.json(potion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/{id}:
 *   put:
 *     summary: Met à jour une potion
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la potion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Potion'
 *     responses:
 *       200:
 *         description: Potion mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Potion'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Potion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', async (req, res) => {
    try {
        const potion = await Potion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!potion) return res.status(404).json({ error: 'Potion non trouvée' });
        res.json(potion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/{id}:
 *   delete:
 *     summary: Supprime une potion
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la potion
 *     responses:
 *       200:
 *         description: Potion supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Potion non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', async (req, res) => {
    try {
        const potion = await Potion.findByIdAndDelete(req.params.id);
        if (!potion) return res.status(404).json({ error: 'Potion non trouvée' });
        res.json({ message: 'Potion supprimée avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;