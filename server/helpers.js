const {check, validationResult} = require('express-validator');

// @brief generic function for checking if a request has invalid input.
// @return: true if there are errors present, false if none
function check_errors(req, res) {
  const errors = validationResult(req);

  // verify that the spin fits within the length bounds
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    res.setHeader('error', JSON.stringify(errors.array()));
    return true;
  }

  return false;
}

module.exports = {
  check_errors,
}