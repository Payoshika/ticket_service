const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: "http://elasticsearch:9200", // Use the service name from docker-compose
  maxRetries: 10, // Retry up to 5 times
  requestTimeout: 60000, // Wait up to 60 seconds for a response
});

esClient.ping({}, (error) => {
  if (error) {
    console.error("Elasticsearch cluster is down!", error);
  } else {
    console.log("Elasticsearch is connected!");
  }
});

module.exports = esClient;
