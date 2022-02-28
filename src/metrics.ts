import type {
  ApiGatewayEventHandlerFactoryOptionMetrics,
} from './types'
import { MetricsLogger, Unit } from 'aws-embedded-metrics'

export const metricsRequestTime = (metrics: MetricsLogger, initTime: number) => {
  const endTime = Date.now() - initTime
  metrics.putMetric('REQUEST_TIME', endTime, Unit.Milliseconds)
}

export const metricsInit = (metrics: MetricsLogger, {
  namespace,
  service
}: ApiGatewayEventHandlerFactoryOptionMetrics) => {
  metrics.setNamespace(namespace)
  metrics.putDimensions({ Service: service })
  metrics.putMetric('REQUEST', 1)
}

export const metricsErrors = (metrics: MetricsLogger, error: any) => {
  metrics.putMetric('ERRORS', 1)
  metrics.setProperty('errors', JSON.stringify(error))
}
