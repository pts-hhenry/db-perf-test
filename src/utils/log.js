const path = require('path');
const callsite = require('callsite');
const chalk = require('chalk');
const config = require('config');
const _ = require('lodash');
const { createLogger, format, transports } = require('winston');

const isDebug = config.get('app.debug') === true;
const isProd = config.get('app.environment') === 'production';

const log = createLogger({
  transports: [
    new transports.Console({
      format: isProd ? format.json() : format.simple(),
      humanReadableUnhandledException: true,
      level: isDebug ? 'debug' : 'info',
      prettyPrint: true,
      stringify: true
    })
  ]
});

const handleDevLogs = (level, message, context) => {
  const color = {
    debug: 'cyan',
    error: 'red',
    info: 'white',
    warn: 'yellow'
  };
  log[level](
    `${chalk[color[level]](message)}${
      context ? chalk.gray(` > ${context}`) : ''
    }`
  );
};

// istanbul ignore next
const handleProdLogs = (level, message, context) => {
  const type = 'application';
  const timestamp = new Date().toISOString();
  log[level]({
    context,
    message,
    timestamp,
    type
  });
};

// istanbul ignore next
const getLogContext = (site) => {
  const excludeSysFilepath = path.join(__dirname, '../../');
  let fileName = _.isString(site.getFileName()) ? site.getFileName() : '';
  fileName = fileName.replace(excludeSysFilepath, '');

  let functionName = 'anonymous';

  if (_.isString(site.getFunctionName())) {
    functionName = `${site
      .getFunctionName()
      .replace(/.then/g, '')
      .replace(/.catch/g, '')}`;
  }

  return `${fileName}#${functionName}, ln ${site.getLineNumber()}`;
};

// istanbul ignore next
exports.logMessage = (level, msg, delta, showContext) => {
  const siteDelta = _.isInteger(delta) ? 2 + delta : 2;
  const site = _.get(callsite(), [siteDelta]);
  const context = getLogContext(site);
  let enhancedMsg = msg;

  if (msg instanceof Error) {
    enhancedMsg = msg.toString();
  } else if (_.isPlainObject(msg) || _.isArray(msg)) {
    enhancedMsg = JSON.stringify(msg);
  }

  if (isProd) {
    handleProdLogs(level, enhancedMsg, context);
  } else {
    handleDevLogs(level, enhancedMsg, showContext === false ? null : context);
  }
};

// eslint-disable-next-line max-len
exports.debug = (msg, siteDelta, showContext) =>
  exports.logMessage('debug', msg, siteDelta, showContext);
// eslint-disable-next-line max-len
exports.info = (msg, siteDelta, showContext) =>
  exports.logMessage('info', msg, siteDelta, showContext);
// eslint-disable-next-line max-len
exports.warn = (msg, siteDelta, showContext) =>
  exports.logMessage('warn', msg, siteDelta, showContext);
// eslint-disable-next-line max-len
exports.error = (msg, siteDelta, showContext) =>
  exports.logMessage('error', msg, siteDelta, showContext);
