/* eslint-disable max-classes-per-file */
class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class StorageNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = {
  StorageError,
  StorageNotFoundError,
};
