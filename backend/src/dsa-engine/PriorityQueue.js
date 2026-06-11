class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this.heap = [];
    this.comparator = comparator;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this.heap[0];
  }

  push(value) {
    this.heap.push(value);
    this._siftUp(this.size() - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    const poppedValue = this.heap[0];
    const bottom = this.heap.pop();
    if (this.size() > 0) {
      this.heap[0] = bottom;
      this._siftDown(0);
    }
    return poppedValue;
  }

  _parent(i) {
    return Math.floor((i - 1) / 2);
  }

  _left(i) {
    return i * 2 + 1;
  }

  _right(i) {
    return i * 2 + 2;
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  _siftUp(i) {
    while (i > 0 && this.comparator(this.heap[i], this.heap[this._parent(i)])) {
      this._swap(i, this._parent(i));
      i = this._parent(i);
    }
  }

  _siftDown(i) {
    let maxIndex = i;
    const left = this._left(i);
    const right = this._right(i);

    if (left < this.size() && this.comparator(this.heap[left], this.heap[maxIndex])) {
      maxIndex = left;
    }
    if (right < this.size() && this.comparator(this.heap[right], this.heap[maxIndex])) {
      maxIndex = right;
    }

    if (i !== maxIndex) {
      this._swap(i, maxIndex);
      this._siftDown(maxIndex);
    }
  }
}

module.exports = PriorityQueue;
