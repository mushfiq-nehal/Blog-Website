const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {

    async create(username, email, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
            [username, email, hashedPassword, role]
        );
        return result.rows[0];
    },

    
    async findById(id) {
        const result = await db.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },


    async findByUsername(username) {
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    },

    
    async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },

    
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },


    async getAll() {
        const result = await db.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    },

    
    async update(id, updates) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (key === 'password') {
                fields.push(`${key} = $${paramCount}`);
                values.push(await bcrypt.hash(value, 10));
            } else {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
            }
            paramCount++;
        }

        values.push(id);
        const result = await db.query(
            `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, username, email, role`,
            values
        );
        return result.rows[0];
    },

    
    async delete(id) {
        await db.query('DELETE FROM users WHERE id = $1', [id]);
    }
};

module.exports = User;
