const express = require('express');
const { StatusCodes } = require('http-status-codes');
const createOneMemberValidations = require('../../../controllers/member-validations/create');
const {
  handleResError,
  handleResSuccess
} = require('../../../utils/response-handler');
const log = require('../../../utils/log');

const { CREATED, OK } = StatusCodes;
const router = express.Router();

router.post('/', async (req, res) => {
  res.setTimeout(2147483647);

  try {
    const { count = 1, dbEngine = 'postgres' } = req.query;
    const result = await createOneMemberValidations(dbEngine, count);

    handleResSuccess(res, CREATED, result);
  } catch (error) {
    log.error(error);

    handleResError(res);
  }
});

module.exports = router;
