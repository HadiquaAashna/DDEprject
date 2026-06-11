/**
 * Fenwick Tree (Binary Indexed Tree)
 * Used for fast range sum queries (e.g. total toll collected between day i and day j)
 * 1-indexed internally.
 */
class FenwickTree {
  constructor(size) {
    this.tree = new Array(size + 1).fill(0);
  }

  // Add 'val' to index 'i' (1-based)
  update(i, val) {
    while (i < this.tree.length) {
      this.tree[i] += val;
      i += i & (-i); // Add least significant set bit
    }
  }

  // Get sum from 1 to i (1-based)
  query(i) {
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & (-i); // Remove least significant set bit
    }
    return sum;
  }

  // Get sum from l to r (1-based)
  queryRange(l, r) {
    return this.query(r) - this.query(l - 1);
  }
}

module.exports = FenwickTree;
