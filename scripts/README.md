# Scripts

Utility scripts for the blog application.

## fix-passwords.js

**Purpose:** Resets the default user passwords to their original values.

**Usage:**
```bash
node scripts/fix-passwords.js
```

**What it does:**
- Updates admin password to: `admin123`
- Updates user password to: `user123`
- Displays current users in the database
- Useful if passwords get changed and you need to reset them

**When to use:**
- After database restore
- If you forget the default passwords
- During development/testing

**Note:** Only use this in development! In production, users should reset their own passwords through a proper password reset flow.
