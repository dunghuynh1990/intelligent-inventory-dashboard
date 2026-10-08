export type LogDetails = Readonly<Record<string, unknown>>

export interface Logger {
  info(event: string, details: LogDetails): void
  error(event: string, details: LogDetails): void
}

export const consoleLogger: Logger = {
  info: (event, details) => console.info(event, details),
  error: (event, details) => console.error(event, details),
}
