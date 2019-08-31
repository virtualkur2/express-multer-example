const helper = (req, res, next) => {
  return res.status(404).json({
    error: 'Resource not found'
  });
}

module.exports = helper;
