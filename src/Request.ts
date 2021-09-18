import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda'

export default class Request<H extends APIGatewayProxyEventHeaders, B = {}, Q extends APIGatewayProxyEventQueryStringParameters = {}> {
  private readonly _body: B | null
  private readonly _headers: H
  private readonly _query: Q | null | undefined

  constructor (
    event: APIGatewayProxyEvent,
    headersValidator: (headers: H | null | undefined) => H,
    bodyValidator: null | ((body: string | null | undefined) => B),
    queryValidator: null | ((query: Q | null | undefined) => Q | null | undefined)
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
  }

  get body (): B | null {
    return this._body
  }

  get headers (): H {
    return this._headers
  }

  get query (): Q | null | undefined {
    return this._query
  }
}
