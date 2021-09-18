import type { ErrorObject } from 'ajv'

const errorParser = (errors: ErrorObject[]): string => {
  return errors.map(e => {
    const errorMessage = e.message ?? 'Unkown error'
    return `${errorMessage.charAt(0).toUpperCase()}${errorMessage.slice(1)}`
  }).join(', ')
}

export default errorParser
