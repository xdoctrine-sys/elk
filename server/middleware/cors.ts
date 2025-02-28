export default defineEventHandler((event) => {
  // Ajouter des headers CORS pour toutes les requêtes API
  event.node.res.setHeader('Access-Control-Allow-Origin', '*')
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  event.node.res.setHeader('Access-Control-Max-Age', '86400')

  // Répondre immédiatement aux requêtes OPTIONS (preflight)
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    return ''
  }
}) 