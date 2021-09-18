import type ServiceError from './ServiceError'

const isServiceError = (error: unknown): error is ServiceError => {
  return (error as ServiceError).name === 'ServiceError'
}

export default isServiceError
