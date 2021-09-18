import Ajv, { JSONSchemaType } from 'ajv'
import type {
  ErrorParser,
  HeadersValidator
} from './types'
import ServiceError from './ServiceError'
import { StatusCodes } from 'http-status-codes'

const ajv = new Ajv({ allErrors: true })

const headersValidator: HeadersValidator = <H>(
  headers: H | null | undefined,
  schema: JSONSchemaType<H>,
  errorParser?: ErrorParser
): H => {
  const validate = ajv.compile<H>(schema)

  if (!validate(headers)) {
    const errors = validate.errors == null ? [] : validate.errors
    let parsedErrorMessage = errors.join('.')
    if (errorParser !== undefined) {
      parsedErrorMessage = errorParser(errors, validate)
    }
    const error = {
      message: 'Invalid Request Header',
      errors: parsedErrorMessage
    }
    throw new ServiceError(
      JSON.stringify(error),
      StatusCodes.BAD_REQUEST
    )
  }

  return headers
}

export default headersValidator
