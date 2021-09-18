import type {
  ResponseBody,
  ResponseType
} from './types'
import type {
  StatusCodes
} from 'http-status-codes'

export default class Response {
  private readonly _body: ResponseBody
  private readonly _statusCode: StatusCodes

  constructor (statusCode: StatusCodes, body: ResponseBody) {
    this._body = body
    this._statusCode = statusCode
  }

  public send (): ResponseType {
    return {
      body: JSON.stringify(this._body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      statusCode: this._statusCode
    }
  }
}
