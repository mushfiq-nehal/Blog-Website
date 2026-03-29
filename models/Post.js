const db = require('../config/database');
const slugify = require('slugify');

const Post = {
    // Create new post
    async create(postData) {
        const { title, content, author_id, visibility, meta_description, meta_keywords } = postData;

        // Generate unique slug
        let slug = slugify(title, { lower: true, strict: true });
        const slugCheck = await db.query('SELECT slug FROM posts WHERE slug = $1', [slug]);

        if (slugCheck.rows.length > 0) {
            slug = `${slug}-${Date.now()}`;
        }

        // Generate excerpt from content (first 150 characters)
        const excerpt = content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';

        const result = await db.query(
            `INSERT INTO posts (title, slug, content, excerpt, author_id, visibility, meta_description, meta_keywords)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [title, slug, content, excerpt, author_id, visibility || 'public', meta_description, meta_keywords]
        );
        return result.rows[0];
    },

    // Find post by ID
    async findById(id) {
        const result = await db.query(
            `SELECT p.*, u.username as author_name, u.email as author_email
             FROM posts p
             JOIN users u ON p.author_id = u.id
             WHERE p.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // Find post by slug
    async findBySlug(slug) {
        const result = await db.query(
            `SELECT p.*, u.username as author_name, u.email as author_email
             FROM posts p
             JOIN users u ON p.author_id = u.id
             WHERE p.slug = $1`,
            [slug]
        );
        return result.rows[0];
    },

    // Get all public posts
    async getAllPublic() {
        const result = await db.query(
            `SELECT p.*, u.username as author_name
             FROM posts p
             JOIN users u ON p.author_id = u.id
             WHERE p.visibility = 'public'
             ORDER BY p.created_at DESC`
        );
        return result.rows;
    },

    // Get all posts (admin view)
    async getAll() {
        const result = await db.query(
            `SELECT p.*, u.username as author_name
             FROM posts p
             JOIN users u ON p.author_id = u.id
             ORDER BY p.created_at DESC`
        );
        return result.rows;
    },

    // Get posts by author
    async getByAuthor(authorId) {
        const result = await db.query(
            `SELECT p.*, u.username as author_name
             FROM posts p
             JOIN users u ON p.author_id = u.id
             WHERE p.author_id = $1
             ORDER BY p.created_at DESC`,
            [authorId]
        );
        return result.rows;
    },

    // Update post
    async update(id, postData) {
        const { title, content, visibility, meta_description, meta_keywords } = postData;

        // Generate new slug if title changed
        let slug = slugify(title, { lower: true, strict: true });
        const currentPost = await db.query('SELECT slug FROM posts WHERE id = $1', [id]);

        if (currentPost.rows[0] && currentPost.rows[0].slug !== slug) {
            const slugCheck = await db.query('SELECT slug FROM posts WHERE slug = $1 AND id != $2', [slug, id]);
            if (slugCheck.rows.length > 0) {
                slug = `${slug}-${Date.now()}`;
            }
        } else {
            slug = currentPost.rows[0].slug;
        }

        const excerpt = content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';

        const result = await db.query(
            `UPDATE posts
             SET title = $1, slug = $2, content = $3, excerpt = $4, visibility = $5,
                 meta_description = $6, meta_keywords = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             RETURNING *`,
            [title, slug, content, excerpt, visibility, meta_description, meta_keywords, id]
        );
        return result.rows[0];
    },

    // Delete post
    async delete(id) {
        await db.query('DELETE FROM posts WHERE id = $1', [id]);
    },

    // Check if user can access post
    async canAccess(postId, userId, userRole) {
        const post = await this.findById(postId);
        if (!post) return false;

        // Public posts are accessible to everyone
        if (post.visibility === 'public') return true;

        // Private posts accessible to author and admin
        if (userRole === 'admin' || post.author_id === userId) return true;

        return false;
    }
};

module.exports = Post;
