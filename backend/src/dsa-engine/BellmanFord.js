/**
 * Bellman-Ford Algorithm
 * Detects shortest path and negative cycles (e.g. for fuel arbitrage simulation)
 * @param {Array} edges - Array of edges { from, to, weight }
 * @param {Number} numVertices - Total number of vertices
 * @param {String} startNode - Starting node ID
 */
function bellmanFord(edges, nodes, startNode) {
  const distances = {};
  const previous = {};

  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[startNode] = 0;

  // Relax edges |V| - 1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    for (let edge of edges) {
      if (distances[edge.from] + edge.weight < distances[edge.to]) {
        distances[edge.to] = distances[edge.from] + edge.weight;
        previous[edge.to] = edge.from;
      }
    }
  }

  // Check for negative-weight cycles
  let hasNegativeCycle = false;
  for (let edge of edges) {
    if (distances[edge.from] + edge.weight < distances[edge.to]) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { distances, previous, hasNegativeCycle };
}

module.exports = { bellmanFord };
