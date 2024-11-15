#!/usr/bin/env node

const { Command } = require('commander');

const { openDb, runQuery, getAllRows } = require('./db');

const program = new Command();

program
  .name('todo-cli')
  .description('CLI for managing todos in SQLite database')
  .version('1.0.0');

program
  .command('init')
  .description('Create SQLite database and todos table')
  .option('-p, --path <path>', 'Database file path', './todos.db')
  .action(async (options) => {
    try {
      const db = await openDb(options.path);

      await runQuery(
        db,
        `
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
      );

      console.log(
        `✅ Database and table created successfully at ${options.path}`,
      );
      db.close();
    } catch (error) {
      console.error('Error initializing database:', error.message);
      global.process.exit(1);
    }
  });
program
  .command('add')
  .description('Add a new todo')
  .option('-p, --path <path>', 'Database file path', './todos.db')
  .requiredOption('-t, --title <title>', 'Todo title')
  .option('-d, --description <description>', 'Todo description')
  .action(async (options) => {
    try {
      const db = await openDb(options.path);

      const result = await runQuery(
        db,
        'INSERT INTO todos (title, description) VALUES (?, ?)',
        [options.title, options.description || null],
      );

      console.log(`✅ Todo added successfully with ID: ${result.lastID}`);

      db.get(
        'SELECT * FROM todos WHERE id = ?',
        [result.lastID],
        (err, row) => {
          if (err) throw err;
          console.log('\nAdded Todo:');
          console.log('------------------------');
          console.log(`ID: ${row.id}`);
          console.log(`Title: ${row.title}`);
          console.log(`Description: ${row.description || 'N/A'}`);
          console.log(`Status: ${row.status}`);
          console.log(`Created: ${row.created_at}`);
          console.log('------------------------');
          db.close();
        },
      );
    } catch (error) {
      console.error('Error adding todo:', error.message);
      global.process.exit(1);
    }
  });

program
  .command('list')
  .description('List all todos')
  .option('-p, --path <path>', 'Database file path', './todos.db')
  .option('-s, --status <status>', 'Filter by status (pending/completed)')
  .option('--search <term>', 'Search in title and description')
  .action(async (options) => {
    try {
      const db = await openDb(options.path);

      let query = 'SELECT * FROM todos WHERE 1=1';
      const params = [];

      if (options.status) {
        query += ' AND status = ?';
        params.push(options.status);
      }

      if (options.search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${options.search}%`, `%${options.search}%`);
      }

      query += ' ORDER BY created_at DESC';

      const todos = await getAllRows(db, query, params);

      if (todos.length === 0) {
        console.log('No todos found.');
        db.close();
        return;
      }

      console.table(todos);
      console.log(`\nTotal todos: ${todos.length}`);

      db.close();
    } catch (error) {
      console.error('Error listing todos:', error.message);
      global.process.exit(1);
    }
  });

program.parse();
