const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "neo4j+s://f8dd7c21.databases.neo4j.io:7687", 
  neo4j.auth.basic("neo4j", "rDrteUGdU5n5iEyfjHIOf0hvabkp3Y-HhW30fm_HFRM")
);

const session = driver.session();

module.exports = { driver, session };
