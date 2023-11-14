require('dotenv').config()

// Import necessary modules
const fs = require('fs')
const mysql = require('mysql2/promise')

// Define an asynchronous function for database migration
const migrate = async () => {
  // Extract necessary database connection details from environment variables
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

  // Create a connection to the MySQL database
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true // Allows executing multiple SQL statements in a single query
  })

  // Drop the database if it exists
  await connection.query(`drop database if exists ${DB_NAME}`)

  // Create a new database
  await connection.query(`create database ${DB_NAME}`)

  // Switch to the newly created database
  await connection.query(`use ${DB_NAME}`)

  // Read the contents of the SQL file (assumed to be named 'database.sql')
  const sql = fs.readFileSync('./database.sql', 'utf8')

  // Execute the SQL statements in the file to set up the database schema
  await connection.query(sql)

  // Close the database connection
  connection.end()
}

// Try to execute the migration function
try {
  migrate()
} catch (err) {
  // Log any errors that occur during migration
  console.error(err)
}
