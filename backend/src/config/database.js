const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(process.env.DATABASE_PATH || './src/database/users.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'parent',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP,
      is_active BOOLEAN DEFAULT 1
    )
  `;

  // Optional: Sessions table for token blacklisting/management
  const sessionsTable = `
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  const childrenTable = `
    CREATE TABLE IF NOT EXISTS children (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name VARCHAR(100) NOT NULL,
      age INTEGER NOT NULL,
      avatar VARCHAR(10) NOT NULL,
      age_group VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  db.serialize(() => {
    db.run(usersTable, (err) => {
      if (err) console.error('Error creating users table:', err.message);
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_email ON users(email)');

    db.run(sessionsTable, (err) => {
      if (err) console.error('Error creating sessions table:', err.message);
    });

    db.run(childrenTable, (err) => {
      if (err) console.error('Error creating children table:', err.message);
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_user_children ON children(user_id)');
  });
}

module.exports = db;
