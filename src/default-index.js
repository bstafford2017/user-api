import { ModuleFilenameHelpers } from 'webpack'

const AWS = require('aws-sdk')
// import { hash } from 'bcrypt'
const { v4 } = require('uuid')
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const usersTable = process.env.USERS_TABLE

const response = (statusCode, message) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  }
}

module.exports.createUser = async (event) => {
  const { username, password, firstName, lastName, admin } = event

  if (!username || !password || !firstName || !lastName || !admin) {
    return response(400, { error: 'Please specify all fields' })
  }

  // const encryptedPassword = await hash(password, 20)

  const user = {
    id: v4(),
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

module.exports.getAllUsers = async () => {
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

module.exports.getUser = async (event) => {
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
    return response(err.statusCode, err)
  }
}

module.exports.updateUser = async (event, context, callback) => {
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
    return response(err.statusCode, err)
  }
}

module.exports.deleteUser = async (event, context, callback) => {
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
    return response(err.statusCode, err)
  }
}