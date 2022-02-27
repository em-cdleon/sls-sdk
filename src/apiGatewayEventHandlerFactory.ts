import type {
  ApiGatewayEventHandlerFactory,
  ApiGatewayEventHandlerFactoryOptionMetrics,
  ApiGatewayEventHandlerResponse,
  ResponseBody
} from './types'
import type { APIGatewayProxyEvent } from 'aws-lambda'
import isError from './isError'
import isServiceError from './isServiceError'
import {
  metricsErrors,
  metricsInit,
  metricsRequestTime
} from 'metrics'
import { metricScope } from 'aws-embedded-metrics'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Response from './Response'
import * as Sentry from '@sentry/serverless'


const apiGatewayEventHandler = metricScope((metrics): ApiGatewayEventHandlerFactory => (
  fn,
  options
) => {
  const handler = async (
    event: APIGatewayProxyEvent
    ): Promise<ApiGatewayEventHandlerResponse> => {
    const initTime = Date.now()

    let metricsOpts: ApiGatewayEventHandlerFactoryOptionMetrics | undefined = undefined
    if (options && options.metrics) {
      metricsOpts = options.metrics
    }

    if (metricsOpts) {
      metricsInit(metrics, metricsOpts)
    } 

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
      if (metricsOpts) {
        metricsErrors(metrics, error)
      }
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      responseBody.message = 'Unknown error'

      if (isError(error)) {
        responseBody.message = error.message
        if (isServiceError(error)) {
          statusCode = error.statusCode
        }
        if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
          const errorMessage: string = error.toString()
          Sentry.captureException(error)
          console.error(errorMessage)
          responseBody.message = ReasonPhrases.INTERNAL_SERVER_ERROR
        }
      }

      const errorResponse = new Response(statusCode, responseBody)

      if (metricsOpts) {
        metricsRequestTime(metrics, initTime)
      }
      return errorResponse.send()
    }

    const response = new Response(statusCode, responseBody)

    if (metricsOpts) {
      metricsRequestTime(metrics, initTime)
    }
    return response.send()
  }

  return handler
})

export default apiGatewayEventHandler
