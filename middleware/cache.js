const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
});

// Middleware de cache générique
const cacheMiddleware = (duration = 300) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;
        
        try {
            const cachedData = await redisClient.get(key);
            
            if (cachedData) {
                console.log('Cache hit:', key);
                return res.json(JSON.parse(cachedData));
            }
            
            // Intercepter la réponse pour la mettre en cache
            const originalSend = res.json;
            res.json = function(data) {
                if (res.statusCode === 200) {
                    redisClient.setex(key, duration, JSON.stringify(data));
                    console.log('Cache set:', key);
                }
                originalSend.call(this, data);
            };
            
            next();
        } catch (error) {
            console.error('Erreur cache:', error);
            next();
        }
    };
};

// Cache spécialisé pour les quiz
const quizCacheMiddleware = cacheMiddleware(600); 

// Cache pour les catégories (plus long car moins fréquemment modifié)
const categoryCacheMiddleware = cacheMiddleware(1800); 

// Fonction pour invalider le cache
const invalidateCache = (pattern) => {
    return new Promise((resolve, reject) => {
        redisClient.keys(pattern, (err, keys) => {
            if (err) return reject(err);
            
            if (keys.length > 0) {
                redisClient.del(keys, (err, result) => {
                    if (err) return reject(err);
                    console.log(`Cache invalidé: ${keys.length} clés supprimées`);
                    resolve(result);
                });
            } else {
                resolve(0);
            }
        });
    });
};

module.exports = {
    cacheMiddleware,
    quizCacheMiddleware,
    categoryCacheMiddleware,
    invalidateCache,
    redisClient
};