const db = require('../config/database');

const Comment = {
    // Create new comment
    async create(postId, userId, content, parentId = null) {
        const result = await db.query(
            `INSERT INTO comments (post_id, user_id, content, parent_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [postId, userId, content, parentId]
        );
        return result.rows[0];
    },

    // Get all comments for a post (with user info)
    async getByPostId(postId) {
        const result = await db.query(
            `SELECT c.*, u.username, u.email
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );
        return result.rows;
    },

    // Get comment by ID
    async findById(id) {
        const result = await db.query(
            `SELECT c.*, u.username
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // Get nested comments structure
    async getNestedComments(postId) {
        const comments = await this.getByPostId(postId);

        // Build nested structure
        const commentMap = {};
        const rootComments = [];

        // First pass: create map
        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment.id] = comment;
        });

        // Second pass: build tree
        comments.forEach(comment => {
            if (comment.parent_id === null) {
                rootComments.push(comment);
            } else {
                const parent = commentMap[comment.parent_id];
                if (parent) {
                    parent.replies.push(comment);
                }
            }
        });

        return rootComments;
    },

    // Get all comments (admin view)
    async getAll() {
        const result = await db.query(
            `SELECT c.*, u.username, p.title as post_title, p.slug as post_slug
             FROM comments c
             JOIN users u ON c.user_id = u.id
             JOIN posts p ON c.post_id = p.id
             ORDER BY c.created_at DESC`
        );
        return result.rows;
    },

    // Update comment
    async update(id, content) {
        const result = await db.query(
            `UPDATE comments
             SET content = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [content, id]
        );
        return result.rows[0];
    },

    // Delete comment and its replies
    async delete(id) {
        // Delete recursively (cascade will handle it due to FK constraint)
        await db.query('DELETE FROM comments WHERE id = $1', [id]);
    },

    // Get comment count for a post
    async getCountByPostId(postId) {
        const result = await db.query(
            'SELECT COUNT(*) as count FROM comments WHERE post_id = $1',
            [postId]
        );
        return parseInt(result.rows[0].count);
    }
};

module.exports = Comment;
