import HttpClientException from '@/lib/exceptions/HttpClientException';

class AppException extends Error {
  constructor(name: string, message: string) {
    const fullMsg = `${name}: ${message}`;
    super(fullMsg);
    this.name = name;
    this.message = fullMsg;
  }

  toString() {
    return this.message;
  }
}

export type errorDetails = {
  message: string;
  stack?: string;
};

export default AppException;
