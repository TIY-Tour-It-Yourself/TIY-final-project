const functions = require("firebase-functions");
const axios = require("axios");

exports.getMapsData = functions.https.onRequest((req, res) => {
  const url = `https://maps.googleapis.com/maps/api/js?key=${
    functions.config().maps.key
  }`;
  axios
    .get(url)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});
