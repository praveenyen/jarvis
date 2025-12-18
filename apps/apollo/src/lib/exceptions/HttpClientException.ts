class HttpClientException extends Error {
  statusCode: number | null;
  errorResp: string | object | null;
  constructor(
    message: string,
    statusCode: number | null,
    errorObj: string | object | null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorResp = errorObj;
  }

  setStatusCode(statusCode: number | null) {
    this.statusCode = statusCode;
  }

  setErrorObj(errorObj: string | object | null) {
    this.errorResp = errorObj;
  }

  getStatusCode() {
    return this.statusCode;
  }
  getErrorResp() {
    return this.errorResp;
  }
}

export default HttpClientException;
