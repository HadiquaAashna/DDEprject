const PriorityQueue = require('./PriorityQueue');

/**
 * Dijkstra's Algorithm
 * Computes shortest path based on a specific metric (distance, time, baseToll)
 * @param {Object} graph - Adjacency list representation { cityId: [{ to: cityId, distance, time, baseToll }] }
 * @param {String} startNode - Starting city ID
 * @param {String} targetNode - Ending city ID
 * @param {String} weightKey - The property to use as weight ('distance', 'time', 'baseToll')
 */
function dijkstra(graph, startNode, targetNode, weightKey = 'distance') {
  const distances = {};
  const previous = {};
  // PQ stores { node, weight } and comparator returns true if a < b (min-heap)
  const pq = new PriorityQueue((a, b) => a.weight < b.weight);

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[startNode] = 0;
  pq.push({ node: startNode, weight: 0 });

  while (!pq.isEmpty()) {
    const { node: u, weight: d } = pq.pop();

    if (u === targetNode) break; // Found shortest path to target

    if (d > distances[u]) continue; // Stale record

    if (!graph[u]) continue;

    for (let neighbor of graph[u]) {
      const v = neighbor.to;
      const weight = neighbor[weightKey];
      const alt = distances[u] + weight;

      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = u;
        pq.push({ node: v, weight: alt });
      }
    }
  }

  // Reconstruct path
  const path = [];
  let curr = targetNode;
  if (distances[targetNode] === Infinity) return { path: [], totalWeight: Infinity };

  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { path, totalWeight: distances[targetNode] };
}

module.exports = { dijkstra };
