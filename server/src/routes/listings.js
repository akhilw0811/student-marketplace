const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/listings
router.get('/', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;
        let query = 'SELECT * FROM listings WHERE is_active = true';
        const params = [];
        let paramIndex = 1;

        if (q) {
            query += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
            params.push(`%${q.toLowerCase()}%`);
            paramIndex++;
        }

        if (category) {
            query += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        if (minPrice) {
            query += ` AND price >= $${paramIndex}`;
            params.push(minPrice);
            paramIndex++;
        }

        if (maxPrice) {
            query += ` AND price <= $${paramIndex}`;
            params.push(maxPrice);
            paramIndex++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json({ listings: result.rows });
    } catch (error) {
        console.error('Get listings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT l.*, u.name as seller_name, u.email as seller_email
            FROM listings l
            JOIN users u ON l.seller_id = u.id
            WHERE l.id = $1 AND l.is_active = true
        `;
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        res.json({ listing: result.rows[0] });
    } catch (error) {
        console.error('Get listing error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/listings (Protected)
router.post(
    '/',
    requireAuth,
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
        body('category').trim().notEmpty().withMessage('Category is required'),
        body('imageUrl').optional().isURL().withMessage('Valid image URL is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { title, description, price, category, imageUrl } = req.body;
            const seller_id = req.user.id;

            const query = `
                INSERT INTO listings (title, description, price, category, image_url, seller_id, is_active)
                VALUES ($1, $2, $3, $4, $5, $6, true)
                RETURNING *
            `;
            const values = [title, description, price, category, imageUrl, seller_id];

            const result = await db.query(query, values);
            res.status(201).json({ listing: result.rows[0] });
        } catch (error) {
            console.error('Create listing error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// PUT /api/listings/:id (Protected, Owner only)
router.put(
    '/:id',
    requireAuth,
    [
        body('title').optional().trim().notEmpty(),
        body('description').optional().trim().notEmpty(),
        body('price').optional().isFloat({ min: 0 }),
        body('category').optional().trim().notEmpty(),
        body('imageUrl').optional().isURL(),
    ],
    async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const userId = req.user.id;

            // Check ownership
            const checkQuery = 'SELECT seller_id FROM listings WHERE id = $1';
            const checkResult = await db.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: 'Listing not found' });
            }

            if (checkResult.rows[0].seller_id !== userId) {
                return res.status(403).json({ error: 'Not authorized' });
            }

            // Build update query
            const fields = [];
            const values = [];
            let paramIndex = 1;

            if (updates.title) {
                fields.push(`title = $${paramIndex}`);
                values.push(updates.title);
                paramIndex++;
            }
            if (updates.description) {
                fields.push(`description = $${paramIndex}`);
                values.push(updates.description);
                paramIndex++;
            }
            if (updates.price) {
                fields.push(`price = $${paramIndex}`);
                values.push(updates.price);
                paramIndex++;
            }
            if (updates.category) {
                fields.push(`category = $${paramIndex}`);
                values.push(updates.category);
                paramIndex++;
            }
            if (updates.imageUrl) {
                fields.push(`image_url = $${paramIndex}`);
                values.push(updates.imageUrl);
                paramIndex++;
            }

            if (fields.length === 0) {
                return res.status(400).json({ error: 'No updates provided' });
            }

            values.push(id);
            const query = `
                UPDATE listings
                SET ${fields.join(', ')}
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const result = await db.query(query, values);
            res.json({ listing: result.rows[0] });
        } catch (error) {
            console.error('Update listing error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// DELETE /api/listings/:id (Protected, Owner only)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check ownership
        const checkQuery = 'SELECT seller_id FROM listings WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        if (checkResult.rows[0].seller_id !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Soft delete
        const query = 'UPDATE listings SET is_active = false WHERE id = $1 RETURNING *';
        await db.query(query, [id]);

        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Delete listing error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
