export class UnknownVersionError extends Error {
  constructor(c: InstanceType<any>) {
    super(`There is no relevant version for ${c.constructor.name}`);
  }
}

export class DataNotDecodableError extends Error {
  constructor(c: InstanceType<any>, data: any) {
    super(`Can't decode ${data} of ${c.constructor.name}`);
  }
}
