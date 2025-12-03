const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages
// Return all messages where current user is sender or receiver
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT 
                m.*,
                u_from.name as from_user_name,
                u_to.name as to_user_name,
                l.title as listing_title
            FROM messages m
            JOIN users u_from ON m.from_user_id = u_from.id
            JOIN users u_to ON m.to_user_id = u_to.id
            LEFT JOIN listings l ON m.listing_id = l.id
            WHERE m.from_user_id = $1 OR m.to_user_id = $1
            ORDER BY m.created_at DESC
        `;
        const result = await db.query(query, [userId]);
        res.json({ messages: result.rows });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/messages/:userId
// Return conversation with specific user
router.get('/:userId', requireAuth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        const query = `
            SELECT 
                m.*,
                u_from.name as from_user_name,
                u_to.name as to_user_name,
                l.title as listing_title
            FROM messages m
            JOIN users u_from ON m.from_user_id = u_from.id
            JOIN users u_to ON m.to_user_id = u_to.id
            LEFT JOIN listings l ON m.listing_id = l.id
            WHERE (m.from_user_id = $1 AND m.to_user_id = $2)
               OR (m.from_user_id = $2 AND m.to_user_id = $1)
            ORDER BY m.created_at ASC
        `;
        const result = await db.query(query, [currentUserId, otherUserId]);
        res.json({ messages: result.rows });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/messages
// Send a message
router.post(
    '/',
    requireAuth,
    [
        body('toUserId').isInt().withMessage('Valid recipient ID is required'),
        body('content').trim().notEmpty().withMessage('Content is required'),
        body('listingId').optional().isInt(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { toUserId, content, listingId } = req.body;
            const fromUserId = req.user.id;

            // Validate recipient exists
            const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [toUserId]);
            if (userCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Recipient not found' });
            }

            // Validate listing exists if provided
            if (listingId) {
                const listingCheck = await db.query('SELECT id FROM listings WHERE id = $1', [listingId]);
                if (listingCheck.rows.length === 0) {
                    return res.status(404).json({ error: 'Listing not found' });
                }
            }

            const query = `
                INSERT INTO messages (from_user_id, to_user_id, listing_id, content)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const result = await db.query(query, [fromUserId, toUserId, listingId || null, content]);

            res.status(201).json({ message: result.rows[0] });
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

module.exports = router;
