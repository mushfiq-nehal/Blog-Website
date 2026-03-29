const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { sanitizeHtml } = require('../middleware/validation');

const postController = {
    // Show all public posts (home page)
    index: async (req, res) => {
        try {
            const posts = await Post.getAllPublic();
            res.render('posts/index', {
                title: 'Home - Blog Website',
                posts,
                meta_description: 'Welcome to our blog. Read the latest articles and stories.',
                meta_keywords: 'blog, articles, stories'
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load posts'
            });
        }
    },

    // Show single post
    show: async (req, res) => {
        try {
            const { slug } = req.params;
            const post = await Post.findBySlug(slug);

            if (!post) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Post not found'
                });
            }

            // Check access permission
            const userId = req.session.userId;
            const userRole = req.session.userRole;

            if (post.visibility === 'private' && (!userId || (post.author_id !== userId && userRole !== 'admin'))) {
                return res.status(403).render('error', {
                    title: 'Access Denied',
                    message: 'You do not have permission to view this post'
                });
            }

            // Get comments
            const comments = await Comment.getNestedComments(post.id);

            // Generate share URLs
            const shareUrl = `${process.env.BASE_URL}/posts/${post.slug}`;
            const shareUrls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                x: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
                linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`
            };

            res.render('posts/show', {
                title: post.title,
                post,
                comments,
                shareUrls,
                meta_description: post.meta_description || post.excerpt,
                meta_keywords: post.meta_keywords || '',
                og_title: post.title,
                og_description: post.meta_description || post.excerpt,
                og_url: shareUrl
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load post'
            });
        }
    },

    // Show create post form
    showCreate: (req, res) => {
        res.render('posts/create', {
            title: 'Create New Post',
            post: null,
            errors: []
        });
    },

    // Create new post
    create: async (req, res) => {
        try {
            const { title, content, visibility, meta_description, meta_keywords } = req.body;

            // Sanitize content
            const sanitizedContent = sanitizeHtml(content);

            const post = await Post.create({
                title,
                content: sanitizedContent,
                author_id: req.session.userId,
                visibility: visibility || 'public',
                meta_description,
                meta_keywords
            });

            // Redirect to the created post
            res.redirect(`/posts/${post.slug}`);
        } catch (error) {
            console.error('Error creating post:', error);
            res.render('posts/create', {
                title: 'Create New Post',
                post: req.body,
                errors: ['Failed to create post. Please try again.']
            });
        }
    },

    // Show edit post form
    showEdit: async (req, res) => {
        try {
            const { slug } = req.params;
            const post = await Post.findBySlug(slug);

            if (!post) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Post not found'
                });
            }

            // Check permission
            if (post.author_id !== req.session.userId && req.session.userRole !== 'admin') {
                return res.status(403).render('error', {
                    title: 'Access Denied',
                    message: 'You do not have permission to edit this post'
                });
            }

            res.render('posts/edit', {
                title: `Edit: ${post.title}`,
                post,
                errors: []
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load post'
            });
        }
    },

    // Update post
    update: async (req, res) => {
        try {
            const { slug } = req.params;
            const post = await Post.findBySlug(slug);

            if (!post) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Post not found'
                });
            }

            // Check permission
            if (post.author_id !== req.session.userId && req.session.userRole !== 'admin') {
                return res.status(403).render('error', {
                    title: 'Access Denied',
                    message: 'You do not have permission to edit this post'
                });
            }

            const { title, content, visibility, meta_description, meta_keywords } = req.body;
            const sanitizedContent = sanitizeHtml(content);

            const updatedPost = await Post.update(post.id, {
                title,
                content: sanitizedContent,
                visibility: visibility || 'public',
                meta_description,
                meta_keywords
            });

            res.redirect(`/posts/${updatedPost.slug}`);
        } catch (error) {
            console.error('Error updating post:', error);
            res.redirect(`/posts/${req.params.slug}/edit`);
        }
    },

    // Delete post
    delete: async (req, res) => {
        try {
            const { slug } = req.params;
            const post = await Post.findBySlug(slug);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Check permission
            if (post.author_id !== req.session.userId && req.session.userRole !== 'admin') {
                return res.status(403).json({ error: 'Access denied' });
            }

            await Post.delete(post.id);
            res.redirect('/posts');
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ error: 'Failed to delete post' });
        }
    }
};

module.exports = postController;
