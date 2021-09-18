import Ajv, { JSONSchemaType } from 'ajv'
import type {
  BodyValidator,
  ErrorParser
} from './types'
import defaultErrorParser from './errorParser'
import ServiceError from './ServiceError'
import { StatusCodes } from 'http-status-codes'

const ajv = new Ajv({ allErrors: true })

const bodyValidator: BodyValidator = <B>(
  body: string | null | undefined,
  schema: JSONSchemaType<B>,
  errorParser?: ErrorParser
): B => {
  body = body ?? '{}'

  const requestBody: B = JSON.parse(body ?? '{}')
  const validate = ajv.compile<B>(schema)

  if (!validate(requestBody)) {
    const errors = validate.errors == null ? [] : validate.errors

    let parsedErrorMessage = ''
    if (errorParser !== undefined) {
      parsedErrorMessage = errorParser(errors, validate)
    } else {
      parsedErrorMessage = `Body error: ${defaultErrorParser(errors)}`
    }

    throw new ServiceError(
      parsedErrorMessage,
      StatusCodes.BAD_REQUEST
    )
  }

  return requestBody
}

export default bodyValidator
