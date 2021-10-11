import Ajv, { JSONSchemaType } from 'ajv'
import defaultErrorParser from './errorParser'
import type {
  ErrorParser,
  ParamsValidator
} from './types'
import ServiceError from './ServiceError'
import { StatusCodes } from 'http-status-codes'

const ajv = new Ajv({ allErrors: true })

const paramsValidator: ParamsValidator = <P>(
  params: P | null | undefined,
  schema: JSONSchemaType<P>,
  errorParser?: ErrorParser
): P => {
  const validate = ajv.compile<P>(schema)

  if (!validate(params)) {
    const errors = validate.errors == null ? [] : validate.errors

    let parsedErrorMessage = ''
    if (errorParser !== undefined) {
      parsedErrorMessage = errorParser(errors, validate)
    } else {
      parsedErrorMessage = `Params error: ${defaultErrorParser(errors)}`
    }

    throw new ServiceError(
      parsedErrorMessage,
      StatusCodes.BAD_REQUEST
    )
  }

  return params
}

export default paramsValidator
