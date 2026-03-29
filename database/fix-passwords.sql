-- Fix default user passwords
-- Run this to update the passwords in the database

-- Update admin password (password: admin123)
UPDATE users SET password = '$2b$10$GjKxnjWu3CDNirvB6WyKDu4Znixs5rpqoNYvXDf/x6Y7yTtaToHA.' WHERE username = 'admin';

-- Update user password (password: user123)
UPDATE users SET password = '$2b$10$zj0iQ68a.Oh1l3vHGchcBOI/oS3I3GW22QtJTtwaDEiwO1S9aLfHe' WHERE username = 'user';

-- Verify the update
SELECT username, email, role, created_at FROM users;
