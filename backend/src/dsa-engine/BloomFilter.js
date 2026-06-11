/**
 * Bloom Filter
 * Probabilistic data structure for fast vehicle verification (e.g. check if a vehicle has a valid pass)
 * False positives are possible, but false negatives are not.
 */
class BloomFilter {
  constructor(size = 1000, numHashFunctions = 3) {
    this.size = size;
    this.bitArray = new Array(this.size).fill(0);
    this.numHashFunctions = numHashFunctions;
  }

  // Simple string hash function
  _hash(str, seed) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * seed + str.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  add(item) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const index = this._hash(item, i + 17); // Use different seeds
      this.bitArray[index] = 1;
    }
  }

  // Returns true if might contain, false if definitely does not contain
  mightContain(item) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const index = this._hash(item, i + 17);
      if (this.bitArray[index] === 0) {
        return false;
      }
    }
    return true;
  }
}

module.exports = BloomFilter;
