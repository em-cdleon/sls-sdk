import type { APIGatewayAuthorizerEvent } from 'aws-lambda'
import type { GenerateAuthorizerPolicyFnOutput } from './types'

const generateAuthorizerPolicy = (
  effect: 'Allow' | 'Deny',
  event: APIGatewayAuthorizerEvent
): GenerateAuthorizerPolicyFnOutput => {
  const authResponse: GenerateAuthorizerPolicyFnOutput = {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: event.methodArn
        }
      ]
    }
  }

  return authResponse
}

export default generateAuthorizerPolicy
