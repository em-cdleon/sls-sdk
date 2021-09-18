import type { StatusCodes } from 'http-status-codes'

export default class ServiceError extends Error {
  public statusCode: StatusCodes

  constructor (message: string, statusCode: StatusCodes) {
    super(message)
    this.name = 'ServiceError'
    this.statusCode = statusCode
  }
}
