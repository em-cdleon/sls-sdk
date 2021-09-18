import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda'
import type { JSONSchemaType, ErrorObject, ValidateFunction } from 'ajv'
import type { StatusCodes } from 'http-status-codes'

export interface ReponseHeaders {
  'Access-Control-Allow-Origin': '*'
  'Content-Type': 'application/json'
}

export interface InputHeaders extends APIGatewayProxyEventHeaders {
  [index: string]: string
}

export interface ApiGatewayEventHandlerInputFnOutput<T={}> {
  data?: T
  message?: string
  statusCode?: number
}

export interface ApiGatewayEventHandlerResponse {
  body: string
  headers: ReponseHeaders
  statusCode: StatusCodes
}

export type ApiGatewayEventHandler = (
  event: APIGatewayProxyEvent
) => Promise<ApiGatewayEventHandlerResponse>

export type ApiGatewayEventHandlerFactoryInputFn<T={}> = (
  event: APIGatewayProxyEvent
) => Promise<ApiGatewayEventHandlerInputFnOutput<T>>

export type HandlerInputFn = ApiGatewayEventHandlerFactoryInputFn

export type ApiGatewayEventHandlerFactory = <T>(
  fn: ApiGatewayEventHandlerFactoryInputFn<T>
) => ApiGatewayEventHandler

export interface ResponseBody<T={}> {
  data?: T
  message: string
}

export interface ResponseType {
  body: string
  headers: ReponseHeaders
  statusCode: StatusCodes
}

export type ErrorParser = (
  errors: ErrorObject[],
  validate: ValidateFunction
) => string

export type BodyValidator = <T>(
  body: string | null | undefined,
  schema: JSONSchemaType<T>,
  errorParser?: ErrorParser
) => T
export type HeadersValidator = <T extends APIGatewayProxyEventHeaders>(
  headers: T | null | undefined,
  schema: JSONSchemaType<T>,
  errorParser?: ErrorParser
) => T
export type QueryValidator = <T extends APIGatewayProxyEventQueryStringParameters>(
  query: T | null | undefined,
  schema: JSONSchemaType<T>,
  errorParser?: ErrorParser
) => T
