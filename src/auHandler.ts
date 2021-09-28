import authorizerEventHandlerFactory from './authorizerEventHandlerFactory'
import type { AuthorizerEventHandlerFactoryInputFn } from './types'
import { AWSLambda } from '@sentry/serverless'
import { config } from './sentry'

AWSLambda.init(config)

const auHandler = (
  fn: AuthorizerEventHandlerFactoryInputFn
) => AWSLambda.wrapHandler(
  authorizerEventHandlerFactory(fn)
)

export default auHandler
