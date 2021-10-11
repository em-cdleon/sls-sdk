import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyEventPathParameters
} from 'aws-lambda'

export default class Request<
  H extends APIGatewayProxyEventHeaders,
  B = {},
  Q extends APIGatewayProxyEventQueryStringParameters = {},
  P extends APIGatewayProxyEventPathParameters = {}
> {
  private readonly _body: B | null
  private readonly _headers: H
  private readonly _query: Q | null | undefined
  private readonly _params: P | null | undefined

  constructor (
    event: APIGatewayProxyEvent,
    headersValidator: (headers: H | null | undefined) => H,
    bodyValidator: null | ((body: string | null | undefined) => B),
    queryValidator: null | ((query: Q | null | undefined) => Q | null | undefined),
    paramsValidator: null | ((params: P | null | undefined) => P | null | undefined)
  ) {
    this._headers = headersValidator(event.headers as H)

    if (bodyValidator !== null) {
      this._body = bodyValidator(event.body)
    } else {
      this._body = null
    }

    if (queryValidator !== null) {
      this._query = queryValidator(event.queryStringParameters as Q)
    } else {
      this._query = null
    }

    if (paramsValidator !== null) {
      this._params = paramsValidator(event.pathParameters as P)
    } else {
      this._params = null
    }
  }

  get body (): B | null {
    return this._body
  }

  get headers (): H {
    return this._headers
  }

  get params (): P | null | undefined {
    return this._params
  }

  get query (): Q | null | undefined {
    return this._query
  }
}
