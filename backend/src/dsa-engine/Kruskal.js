class DisjointSet {
  constructor(elements) {
    this.parent = {};
    this.rank = {};
    elements.forEach(e => {
      this.parent[e] = e;
      this.rank[e] = 0;
    });
  }

  find(i) {
    if (this.parent[i] === undefined) {
      this.parent[i] = i;
      this.rank[i] = 0;
    }
    if (this.parent[i] === i) return i;
    // Path compression
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI !== rootJ) {
      if (this.rank[rootI] < this.rank[rootJ]) {
        this.parent[rootI] = rootJ;
      } else if (this.rank[rootI] > this.rank[rootJ]) {
        this.parent[rootJ] = rootI;
      } else {
        this.parent[rootJ] = rootI;
        this.rank[rootI]++;
      }
    }
  }
}

/**
 * Kruskal's Algorithm for Minimum Spanning Tree
 * Optimizes network layout (e.g. least expensive way to connect all cities)
 * @param {Array} edges - Array of edges { from, to, weight }
 * @param {Array} nodes - Array of node IDs
 */
function kruskal(edges, nodes) {
  const mst = [];
  const dsu = new DisjointSet(nodes);

  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);

  for (let edge of edges) {
    const root1 = dsu.find(edge.from);
    const root2 = dsu.find(edge.to);

    if (root1 !== root2) {
      mst.push(edge);
      dsu.union(root1, root2);
    }
  }

  return mst;
}

module.exports = { kruskal, DisjointSet };
