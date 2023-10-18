import User from '../types/user.type'
import connection from '../db-config'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

// Fonction générique pour exécuter une requête SQL et renvoyer un résultat typé
const executeQuery = <T>(queryString: string, params: (number | string)[] = []): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    connection.query(queryString, params, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result as T)
      }
    })
  })
}

export const findAllUsers = async (): Promise<User[]> => {
  const queryString = `SELECT u.id, u.username, u.password, r.role_name, r.role_code
  FROM user AS u
  JOIN ts_wild_wall.role AS r ON u.role_id = r.id;
  `
  const rows = await executeQuery<RowDataPacket[]>(queryString)

  const users: User[] = rows.map((row) => ({
    userId: row.id,
    username: row.username,
    password: row.password,
    role: row.role_name,
    role_code: row.role_code
  }))

  return users
}

export const findUserById = async (userId: number): Promise<User | null> => {
  const queryString = `SELECT u.id, u.username, u.password, r.role_name, r.role_code
    FROM user AS u
    JOIN ts_wild_wall.role AS r ON u.role_id = r.id
    WHERE u.id = ?;`
  const rows = await executeQuery<RowDataPacket[]>(queryString, [userId])
  if (rows.length === 0) {
    return null
  }
  const row = rows[0]
  const user: User = {
    userId: row.id,
    username: row.username,
    password: row.password,
    role: row.role_name,
    role_code: row.role_code
  }
  return user
}

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const queryString = `SELECT u.id, u.username, u.password, r.role_name, r.role_code
  FROM user AS u
  JOIN ts_wild_wall.role AS r ON u.role_id = r.id
  WHERE u.username = ?;`
  const rows = await executeQuery<RowDataPacket[]>(queryString, [username])
  if (rows.length === 0) {
    return null
  }
  const row = rows[0]
  const user: User = {
    userId: row.id,
    username: row.username,
    password: row.password,
    role: row.role_name,
    role_code: row.role_code
  }
  return user
}

export const insertUser = async (newUser: User): Promise<ResultSetHeader> => {
  const queryString = `INSERT INTO user (username, password, role_id) VALUES (?, ?, 3);`
  const params = [newUser.username, newUser.password]
  return await executeQuery<ResultSetHeader>(queryString, params)
}

export const updateRole = async (userId: number, newRoleCode: string): Promise<ResultSetHeader> => {
  const queryString = `UPDATE user
  SET role_id = ?
  WHERE id = ?;`
  return await executeQuery<ResultSetHeader>(queryString, [newRoleCode, userId])
}

export const deleteUser = async (userId: number): Promise<ResultSetHeader> => {
  const queryString = `DELETE FROM user WHERE id = ?`
  return await executeQuery<ResultSetHeader>(queryString, [userId])
}
