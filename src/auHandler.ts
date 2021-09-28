import authorizerEventHandlerFactory from './authorizerEventHandlerFactory'
import type { AuthorizerEventHandlerFactoryInputFn } from './types'

const auHandler = (
  fn: AuthorizerEventHandlerFactoryInputFn
) => authorizerEventHandlerFactory(fn)

export default auHandler
