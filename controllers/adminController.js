const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

const adminController = {
    
    dashboard: async (req, res) => {
        try {
            const posts = await Post.getAll();
            const users = await User.getAll();
            const comments = await Comment.getAll();

            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                posts,
                users,
                comments,
                stats: {
                    totalPosts: posts.length,
                    totalUsers: users.length,
                    totalComments: comments.length,
                    publicPosts: posts.filter(p => p.visibility === 'public').length,
                    privatePosts: posts.filter(p => p.visibility === 'private').length
                }
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load dashboard'
            });
        }
    },

    
    managePosts: async (req, res) => {
        try {
            const posts = await Post.getAll();
            res.render('admin/posts', {
                title: 'Manage Posts',
                posts
            });
        } catch (error) {
            console.error('Error loading posts:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load posts'
            });
        }
    },

    
    manageUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.render('admin/users', {
                title: 'Manage Users',
                users
            });
        } catch (error) {
            console.error('Error loading users:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load users'
            });
        }
    },

    
    manageComments: async (req, res) => {
        try {
            const comments = await Comment.getAll();
            res.render('admin/comments', {
                title: 'Manage Comments',
                comments
            });
        } catch (error) {
            console.error('Error loading comments:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Failed to load comments'
            });
        }
    }
};

module.exports = adminController;
