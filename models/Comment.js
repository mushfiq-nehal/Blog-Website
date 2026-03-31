const db = require('../config/database');

const Comment = {

    async create(postId, userId, content, parentId = null) {
        const result = await db.query(
            `INSERT INTO comments (post_id, user_id, content, parent_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [postId, userId, content, parentId]
        );
        return result.rows[0];
    },

    
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

    
    async getNestedComments(postId) {
        const comments = await this.getByPostId(postId);

        
        const commentMap = {};
        const rootComments = [];

        
        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment.id] = comment;
        });

        
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

    
    async delete(id) {
        await db.query('DELETE FROM comments WHERE id = $1', [id]);
    },


    async getCountByPostId(postId) {
        const result = await db.query(
            'SELECT COUNT(*) as count FROM comments WHERE post_id = $1',
            [postId]
        );
        return parseInt(result.rows[0].count);
    }
};

module.exports = Comment;
