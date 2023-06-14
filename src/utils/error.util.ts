export class CustomError extends Error {
  constructor(name: string, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = name;
  }
}
