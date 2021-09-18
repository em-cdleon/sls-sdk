import apiGatewayEventHandlerFactory from './apiGatewayEventHandlerFactory'
import type { ApiGatewayEventHandlerFactoryInputFn } from './types'
import { AWSLambda } from '@sentry/serverless'
import { config } from './sentry'

AWSLambda.init(config)

const agHandler = (
  fn: ApiGatewayEventHandlerFactoryInputFn
) => AWSLambda.wrapHandler(
  apiGatewayEventHandlerFactory(fn)
)

export default agHandler
