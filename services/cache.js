const mongoose = require('mongoose');
const redis = require('redis');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
async function connectRedis() {
  try {
    await client.connect();
    // console.log('redis connected');
  }
  catch (error) {
    // console.log('redis connection error', error);
  }
}
connectRedis();

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
}

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return await exec.apply(this, arguments);
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));
  
  const cache = await client.hGet(this.hashKey, key);

  if (cache) {
    const doc = JSON.parse(cache);
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(d);
  }

  const result = await exec.apply(this, arguments);

  await client.hSet(this.hashKey, key, JSON.stringify(result));

  return result;
}