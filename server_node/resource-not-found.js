const resourceNotFound = (req, res) => {
  res.status(404).send("The resource does not exist");
};

module.exports = resourceNotFound;
