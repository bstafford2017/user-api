import { DynamoDB } from 'aws-sdk'
// import { hash } from 'bcrypt'
import { v4 as uuid } from 'uuid'

const db = new DynamoDB.DocumentClient()

const usersTable: string = process.env.USERS_TABLE || 'Users'

interface Response {
  statusCode: number
  headers: any
  body: string
}

interface User {
  id: string
  createdAt: string
  username: string
  password: string
  firstName: string
  lastName: string
  admin: boolean
}

const response = (statusCode: number, message: any): Response => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  }
}

export const createUser = async (event: any) => {
  const { username, password, firstName, lastName, admin } = event

  if (!username || !password || !firstName || !lastName || !admin) {
    return response(400, { error: 'Please specify all fields' })
  }

  // const encryptedPassword = await hash(password, 20)

  const user: User = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    username,
    // password: encryptedPassword,
    password,
    firstName,
    lastName,
    admin
  }

  try {
    const data = await db
      .put({
        TableName: usersTable,
        Item: user
      })
      .promise()
    return response(200, data)
  } catch (e) {
    return response(e.statusCode, e)
  }
}

export const getAllUsers = async () => {
  try {
    const data = await db
      .scan({
        TableName: usersTable
      })
      .promise()
    return response(200, data)
  } catch (e) {
    return response(e.statusCode, e)
  }
}

export const getUser = async (event: any) => {
  const { pathParameters = {} } = event
  const { id = '' } = pathParameters

  if (!id) {
    return response(400, {
      error: 'Please specify an id in the url parameters'
    })
  }

  const params = {
    Key: {
      id
    },
    TableName: usersTable
  }

  try {
    const data = await db.get(params).promise()
    return response(200, data)
  } catch (e) {
    return response(e.statusCode, e)
  }
}

export const updateUser = async (event: any) => {
  const { pathParameters = {} } = event
  const { id = '' } = pathParameters
  const { username, password, firstName, lastName, admin } = event

  if (!username || !password || !firstName || !lastName || !admin) {
    return response(400, { error: 'Please specify all fields' })
  }

  // const encryptedPassword = await hash(password, 20)

  const params = {
    Key: {
      id
    },
    TableName: usersTable,
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression:
      'SET username = :username, password = :password, firstName = :firstName, lastName = :lastName, admin = :admin',
    ExpressionAttributeValues: {
      ':username': username,
      // ':password': encryptedPassword,
      ':password': password,
      ':firstName': firstName,
      ':lastName': lastName,
      ':admin': admin
    },
    ReturnValues: 'ALL_NEW'
  }

  try {
    const data = await db.update(params).promise()
    return response(200, data)
  } catch (e) {
    return response(e.statusCode, e)
  }
}

export const deleteUser = async (event: any) => {
  const { pathParameters = {} } = event
  const { id = '' } = pathParameters

  if (!id) {
    return response(400, {
      error: 'Please specify an id in the url parameters'
    })
  }

  const params = {
    Key: {
      id
    },
    TableName: usersTable
  }

  try {
    const data = await db.delete(params).promise()
    return response(200, data)
  } catch (e) {
    return response(e.statusCode, e)
  }
}
