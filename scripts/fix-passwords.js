// Fix passwords in database
require('dotenv').config();
const { pool } = require('./config/database');

async function fixPasswords() {
    try {
        console.log('Updating passwords...');

        // Update admin password
        await pool.query(
            "UPDATE users SET password = $1 WHERE username = 'admin'",
            ['$2b$10$GjKxnjWu3CDNirvB6WyKDu4Znixs5rpqoNYvXDf/x6Y7yTtaToHA.']
        );
        console.log('✓ Admin password updated');

        // Update user password
        await pool.query(
            "UPDATE users SET password = $1 WHERE username = 'user'",
            ['$2b$10$zj0iQ68a.Oh1l3vHGchcBOI/oS3I3GW22QtJTtwaDEiwO1S9aLfHe']
        );
        console.log('✓ User password updated');

        // Verify users exist
        const result = await pool.query('SELECT username, email, role FROM users');
        console.log('\nCurrent users in database:');
        console.table(result.rows);

        console.log('\n✅ Passwords fixed successfully!');
        console.log('\nYou can now login with:');
        console.log('  Admin - username: admin, password: admin123');
        console.log('  User  - username: user, password: user123');

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error fixing passwords:', error);
        process.exit(1);
    }
}

fixPasswords();
