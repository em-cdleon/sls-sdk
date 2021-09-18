import type { APIGatewayProxyEvent } from 'aws-lambda'
import type {
  ApiGatewayEventHandlerFactory,
  ApiGatewayEventHandlerResponse,
  ResponseBody
} from './types'
import isError from './isError'
import isServiceError from './isServiceError'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Response from './Response'
import * as Sentry from '@sentry/serverless'

const apiGatewayEventHandler: ApiGatewayEventHandlerFactory = (
  fn
) => {
  const handler = async (
    event: APIGatewayProxyEvent
  ): Promise<ApiGatewayEventHandlerResponse> => {
    let statusCode = StatusCodes.OK
    const responseBody: ResponseBody = {
      message: ReasonPhrases.OK
    }

    try {
      const r = await fn(event)
      if (r.statusCode !== undefined) { statusCode = r.statusCode }
      if (r.message !== undefined) { responseBody.message = r.message }
      if (r.data !== undefined) { responseBody.data = r.data }
    } catch (error) {
      if (isError(error)) {
        responseBody.message = error.message
        if (isServiceError(error)) {
          statusCode = error.statusCode
        } else {
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        }
        if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
          const errorMessage: string = error.toString()
          Sentry.captureException(error)
          console.error(errorMessage)
          responseBody.message = ReasonPhrases.INTERNAL_SERVER_ERROR
        }
        const errorResponse = new Response(statusCode, responseBody)
        return errorResponse.send()
      } else {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        responseBody.message = 'Unknown error'
        const errorResponse = new Response(statusCode, responseBody)
        return errorResponse.send()
      }
    }

    const response = new Response(statusCode, responseBody)
    return response.send()
  }

  return handler
}

export default apiGatewayEventHandler
