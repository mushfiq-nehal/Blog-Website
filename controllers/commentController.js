const Comment = require('../models/Comment');
const Post = require('../models/Post');

const commentController = {
    
    create: async (req, res) => {
        try {
            const { postId, content, parentId } = req.body;
            const userId = req.session.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Please login to comment' });
            }

            
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            
            await Comment.create(
                postId,
                userId,
                content,
                parentId || null
            );

            
            res.redirect(`/posts/${post.slug}#comments`);
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ error: 'Failed to create comment' });
        }
    },

    
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const comment = await Comment.findById(id);

            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            
            if (comment.user_id !== req.session.userId && req.session.userRole !== 'admin') {
                return res.status(403).json({ error: 'Access denied' });
            }

            await Comment.delete(id);

            
            const post = await Post.findById(comment.post_id);
            res.redirect(`/posts/${post.slug}#comments`);
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'Failed to delete comment' });
        }
    }
};

module.exports = commentController;
