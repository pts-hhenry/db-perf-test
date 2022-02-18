const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { handleResError } = require('../../../utils/response-handler');

const router = express.Router();

router.all('/', (req, res) => {
  handleResError(res, StatusCodes.NOT_FOUND);
});

module.exports = router;
