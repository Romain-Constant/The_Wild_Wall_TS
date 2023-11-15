import dotenv from 'dotenv'

// load environment variables
dotenv.config()

// Import necessary modules
const fs = require('fs')
const mysql = require('mysql2/promise')

// Define the migration function
const migrate = async () => {
  // Destructure environment variables
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

  // Create a connection to the MySQL database server
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  })

  // Drop the database if it exists, create a new one, and switch to it
  await connection.query(`drop database if exists ${DB_NAME}`)
  await connection.query(`create database ${DB_NAME}`)
  await connection.query(`use ${DB_NAME}`)

  // Read the SQL migration script from the file
  const sql = fs.readFileSync('./database.sql', 'utf8')

  // Execute the SQL migration script
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
