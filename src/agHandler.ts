import apiGatewayEventHandlerFactory from './apiGatewayEventHandlerFactory'
import type { ApiGatewayEventHandlerFactoryInputFn, ApiGatewayEventHandlerFactoryOptions } from './types'
import { AWSLambda } from '@sentry/serverless'
import { config } from './sentry'

AWSLambda.init(config)

const agHandler = (
  fn: ApiGatewayEventHandlerFactoryInputFn,
  options?: ApiGatewayEventHandlerFactoryOptions
) => AWSLambda.wrapHandler(
  apiGatewayEventHandlerFactory(fn, options)
)

export default agHandler
