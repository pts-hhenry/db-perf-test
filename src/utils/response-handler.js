const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const _ = require('lodash');
const {
  ERR_CODE_INTERNAL_SERVER_ERROR,
  ERR_CODE_RESOURCE_CONFLICT,
  ERR_CODE_RESOURCE_FORBIDDEN,
  ERR_CODE_RESOURCE_NOT_FOUND,
  ERR_CODE_TOO_MANY_REQUESTS,
  ERR_CODE_UNAUTHORIZED,
  ERR_CODE_UNPROCESSABLE_ENTITY,
  ERR_CODE_VALIDATION_ERROR
} = require('../constants/error-codes');

const {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  MOVED_PERMANENTLY,
  MOVED_TEMPORARILY,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} = StatusCodes;

const errorCodeMapping = {
  [BAD_REQUEST]: ERR_CODE_VALIDATION_ERROR,
  [CONFLICT]: ERR_CODE_RESOURCE_CONFLICT,
  [FORBIDDEN]: ERR_CODE_RESOURCE_FORBIDDEN,
  [INTERNAL_SERVER_ERROR]: ERR_CODE_INTERNAL_SERVER_ERROR,
  [NOT_FOUND]: ERR_CODE_RESOURCE_NOT_FOUND,
  [TOO_MANY_REQUESTS]: ERR_CODE_TOO_MANY_REQUESTS,
  [UNAUTHORIZED]: ERR_CODE_UNAUTHORIZED,
  [UNPROCESSABLE_ENTITY]: ERR_CODE_UNPROCESSABLE_ENTITY
};

exports.handleResError = (res, status, message, errorCode, meta) => {
  const statusCode = [
    BAD_REQUEST,
    CONFLICT,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    TOO_MANY_REQUESTS,
    UNAUTHORIZED,
    UNPROCESSABLE_ENTITY
  ].includes(status)
    ? status
    : INTERNAL_SERVER_ERROR;
  const statusText = getReasonPhrase(statusCode);

  const payload = {
    errorCode: errorCode || errorCodeMapping[statusCode],
    message: message || statusText,
    meta: meta || {},
    statusCode,
    statusText
  };

  res.status(statusCode).json(payload);
};

exports.handleResRedirect = (res, status, url) => {
  const statusCode = [MOVED_PERMANENTLY, MOVED_TEMPORARILY].includes(status)
    ? status
    : MOVED_TEMPORARILY;

  res.redirect(statusCode, url);
};

exports.handleResSuccess = (res, status, data = null) => {
  const statusCode = [CREATED, NO_CONTENT, OK].includes(status) ? status : OK;
  const statusText = getReasonPhrase(statusCode);
  const statusInfo = {
    statusCode,
    statusText
  };
  const payload = _.isObject(data) ? data : statusInfo;

  res.status(statusCode).json(payload);
};
