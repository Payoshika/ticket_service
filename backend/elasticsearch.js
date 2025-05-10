const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: "http://elasticsearch:9200", // Use the service name from docker-compose
});

esClient.ping({}, (error) => {
  if (error) {
    console.error("Elasticsearch cluster is down!", error);
  } else {
    console.log("Elasticsearch is connected!");
  }
});

module.exports = esClient;
