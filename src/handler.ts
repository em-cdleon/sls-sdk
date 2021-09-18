import apiGatewayEventHandlerFactory from './apiGatewayEventHandlerFactory'
import type { ApiGatewayEventHandlerFactoryInputFn } from './types'
import { AWSLambda } from '@sentry/serverless'
import { config } from './sentry'

AWSLambda.init(config)

const handler = (fn: ApiGatewayEventHandlerFactoryInputFn) => AWSLambda.wrapHandler(
  apiGatewayEventHandlerFactory(fn)
)

export default handler
