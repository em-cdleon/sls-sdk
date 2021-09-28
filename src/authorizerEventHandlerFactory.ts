import type { APIGatewayAuthorizerEvent } from 'aws-lambda'
import type {
  AuthorizerEventHandlerFactory,
  AuthorizerEventHandlerResponse
} from './types'
import generateAuthorizerPolicy from './generateAuthorizerPolicy'
import * as Sentry from '@sentry/serverless'

const authorizerEventHandler: AuthorizerEventHandlerFactory = (
  fn
) => {
  const handler = async (
    event: APIGatewayAuthorizerEvent
  ): Promise<AuthorizerEventHandlerResponse> => {
    try {
      const r = await fn(event)
      if (r === 'Allow') {
        return generateAuthorizerPolicy(
          'Allow',
          event
        ) as AuthorizerEventHandlerResponse
      }
    } catch (error) {
      Sentry.captureException(error)
      console.error(error)
    }
    return generateAuthorizerPolicy(
      'Deny',
      event
    ) as AuthorizerEventHandlerResponse
  }
  return handler
}

export default authorizerEventHandler

