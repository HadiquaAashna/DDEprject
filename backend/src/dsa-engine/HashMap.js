/**
 * Custom Hash Map Implementation
 * Used for O(1) lookups for vehicles, tolls, and cities
 */
class HashMap {
  constructor(size = 100) {
    this.buckets = new Array(size);
    this.numBuckets = size;
  }

  _hash(key) {
    let hash = 0;
    const strKey = String(key);
    for (let i = 0; i < strKey.length; i++) {
      hash = (hash + strKey.charCodeAt(i) * 23) % this.numBuckets;
    }
    return hash;
  }

  set(key, value) {
    const index = this._hash(key);
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }
    // Check if key already exists
    for (let i = 0; i < this.buckets[index].length; i++) {
      if (this.buckets[index][i][0] === key) {
        this.buckets[index][i][1] = value;
        return;
      }
    }
    this.buckets[index].push([key, value]);
  }

  get(key) {
    const index = this._hash(key);
    if (!this.buckets[index]) return undefined;

    for (let i = 0; i < this.buckets[index].length; i++) {
      if (this.buckets[index][i][0] === key) {
        return this.buckets[index][i][1];
      }
    }
    return undefined;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    const index = this._hash(key);
    if (!this.buckets[index]) return false;

    for (let i = 0; i < this.buckets[index].length; i++) {
      if (this.buckets[index][i][0] === key) {
        this.buckets[index].splice(i, 1);
        return true;
      }
    }
    return false;
  }
}

module.exports = HashMap;
