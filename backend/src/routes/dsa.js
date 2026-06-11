const express = require('express');
const router = express.Router();
const City = require('../models/City');
const Route = require('../models/Route');
const TollPlaza = require('../models/TollPlaza');
const TollRecord = require('../models/TollRecord');
const { dijkstra } = require('../dsa-engine/Dijkstra');
const { kruskal } = require('../dsa-engine/Kruskal');
const { bellmanFord } = require('../dsa-engine/BellmanFord');

// Helper to build graph from DB
const buildGraph = async () => {
  const routes = await Route.find().populate('fromCity').populate('toCity');
  const cities = await City.find();
  const graph = {};
  
  routes.forEach(r => {
    if (!r.fromCity || !r.toCity) return;
    const from = r.fromCity._id.toString();
    const to = r.toCity._id.toString();
    
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];

    // Assuming undirected graph for roads
    graph[from].push({ to, distance: r.distance, time: r.time, baseToll: r.baseToll });
    graph[to].push({ to: from, distance: r.distance, time: r.time, baseToll: r.baseToll });
  });

  return { graph, routes, cities };
};

// 1. Dijkstra - Shortest Path
router.get('/shortest-path', async (req, res) => {
  const { from, to, metric } = req.query; // metric: distance, time, baseToll
  if (!from || !to) return res.status(400).json({ message: 'Missing from/to params' });

  try {
    const { graph, cities } = await buildGraph();
    const result = dijkstra(graph, from, to, metric || 'distance');
    
    // Map IDs back to full city objects for frontend visualization
    const pathCities = result.path.map(id => cities.find(c => c._id.toString() === id));

    res.json({
      path: pathCities,
      totalWeight: result.totalWeight
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating shortest path', error: error.message });
  }
});

// 2. Kruskal - Minimum Spanning Tree
router.get('/mst', async (req, res) => {
  try {
    const { routes, cities } = await buildGraph();
    
    // Kruskal needs an array of edges {from, to, weight}
    const edges = routes.map(r => ({
      from: r.fromCity._id.toString(),
      to: r.toCity._id.toString(),
      weight: r.distance // MST based on distance
    }));
    
    const nodes = cities.map(c => c._id.toString());
    const mst = kruskal(edges, nodes);
    
    // Map IDs back to full city objects
    const mstDetailed = mst.map(edge => ({
      from: cities.find(c => c._id.toString() === edge.from),
      to: cities.find(c => c._id.toString() === edge.to),
      weight: edge.weight
    }));

    res.json(mstDetailed);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating MST', error: error.message });
  }
});

// 3. Bellman-Ford
router.get('/bellman-ford', async (req, res) => {
  const { from } = req.query;
  if (!from) return res.status(400).json({ message: 'Missing from param' });

  try {
    const { routes, cities } = await buildGraph();
    // For Bellman-Ford, we treat it as directed edges for full graph coverage
    const edges = [];
    routes.forEach(r => {
      edges.push({ from: r.fromCity._id.toString(), to: r.toCity._id.toString(), weight: r.distance });
      edges.push({ from: r.toCity._id.toString(), to: r.fromCity._id.toString(), weight: r.distance });
    });
    
    const nodes = cities.map(c => c._id.toString());
    const result = bellmanFord(edges, nodes, from);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error running Bellman-Ford', error: error.message });
  }
});

// 4. Priority Queue - Top K Plazas
router.get('/top-plazas', async (req, res) => {
  const k = parseInt(req.query.k) || 5;
  try {
    const topPlazas = await TollRecord.aggregate([
      { $group: { _id: "$tollPlaza", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: k }
    ]);
    
    const populated = await TollPlaza.populate(topPlazas, { path: '_id' });
    
    const result = populated.map(p => ({
      plaza: p._id,
      count: p.count
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top plazas', error: error.message });
  }
});

module.exports = router;
