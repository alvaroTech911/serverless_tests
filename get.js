import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'

export const main = async (ev, context) => {
  const params = {
    TableName: 'notes',
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: ev.requestContext.identity.cognitoIdentityId,
      noteId: ev.pathParameters.id
    }
  }

  try {
    const result = await dynamoDbLib.call('get', params)
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item)
    } else {
      return failure({
        status: false,
        error: 'Item not found.'
      })
    }
  } catch (error) {
    console.log(error)
    return failure({ status: false })
  }
}