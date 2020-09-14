class Observable {
  constructor(initialValue) {
    this._value = initialValue;
    this._observers = [];
  }

  subscribe(observer) {
    observer(this._value);
    const observerIndex = this._observers.push(observer) - 1;
    return () => {
      this._unsubscribe(observerIndex);
    };
  }

  next(value) {
    this._value = value;
    this._notify();
  }

  _unsubscribe(observerIndex) {
    this._observers.splice(observerIndex, 1);
  }

  _notify() {
    this._observers.forEach((observer) => {
      observer(this._value);
    });
  }
}

class CellReferenceError extends Error {
  constructor(cell) {
    super(`Referenced Cell "${cell}" does not exist`);
    this.cell = cell;
  }
}

export { CellReferenceError, Observable };
