const cors = require("cors");

module.exports = function (app) {
  corsOptions = {
    origin: "https://dolan-showcase.herokuapp.com/",
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
};
