import type {
  APIGatewayAuthorizerEvent,
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

export type ApiGatewayEventHandlerFactory = <T>(
  fn: ApiGatewayEventHandlerFactoryInputFn<T>
) => ApiGatewayEventHandler

export type ApiGatewayEventHandlerFactoryInputFn<T = {}> = (
  event: APIGatewayProxyEvent
) => Promise<ApiGatewayEventHandlerInputFnOutput<T>>

export interface ApiGatewayEventHandlerInputFnOutput<T={}> {
  data?: T
  message?: string
  statusCode?: number
}

export type ApiGatewayEventHandler = (
  event: APIGatewayProxyEvent
) => Promise<ApiGatewayEventHandlerResponse>

export interface ApiGatewayEventHandlerResponse {
  body: string
  headers: ReponseHeaders
  statusCode: StatusCodes
}

export type AGHandlerInputFn<T={}> = ApiGatewayEventHandlerFactoryInputFn<T>

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

export interface Statement {
  Action: string
  Effect: string
  Resource: string
}

export interface GenerateAuthorizerPolicyFnOutput {
  principalId: string
  policyDocument: {
    Version: string
    Statement: Statement[]
  }
}

export type AuthorizerEventHandlerFactory = (
  fn: AuthorizerEventHandlerFactoryInputFn
) => AuthorizerEventHandler

export type AuthorizerEventHandlerFactoryInputFn = (
  event: APIGatewayAuthorizerEvent
) => Promise<AuthorizerEventHandlerInputFnOutput>

export type AuthorizerEventHandlerInputFnOutput = 'Allow' | 'Deny'

export type AuthorizerEventHandler = (
  event: APIGatewayAuthorizerEvent
) => Promise<AuthorizerEventHandlerResponse>

export type AuthorizerEventHandlerResponse = GenerateAuthorizerPolicyFnOutput

export type AuHandlerInputFn = AuthorizerEventHandlerFactoryInputFn
