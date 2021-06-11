export class ApplicationError extends Error {
  constructor (statusCode, message = 'an error occurred', errors) {
    super(message)
    this.statusCode = statusCode || 500
    this.message = message
    this.errors = errors
  }
}

export class NotFoundError extends ApplicationError {
  constructor (message) {
    super(404, message || 'resource not found')
  }
}

export class NotYourPatternError extends ApplicationError {
  constructor (message) {
    super(403, message || 'this pattern is not yours')
  }
}

export class BuyThatPatternError extends ApplicationError {
  constructor (message) {
    super(403, message || 'the user did not buy this pattern')
  }
}
