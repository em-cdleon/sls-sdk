import Ajv, { JSONSchemaType } from 'ajv'
import defaultErrorParser from './errorParser'
import type {
  ErrorParser,
  QueryValidator
} from './types'
import ServiceError from './ServiceError'
import { StatusCodes } from 'http-status-codes'

const ajv = new Ajv({ allErrors: true })

const queryValidator: QueryValidator = <Q>(
  query: Q | null | undefined,
  schema: JSONSchemaType<Q>,
  errorParser?: ErrorParser
): Q => {
  const validate = ajv.compile<Q>(schema)

  if (!validate(query)) {
    const errors = validate.errors == null ? [] : validate.errors
    let parsedErrorMessage = ''
    if (errorParser !== undefined) {
      parsedErrorMessage = errorParser(errors, validate)
    } else {
      parsedErrorMessage = `Query error: ${defaultErrorParser(errors)}`
    }

    throw new ServiceError(
      parsedErrorMessage,
      StatusCodes.BAD_REQUEST
    )
  }

  return query
}

export default queryValidator
