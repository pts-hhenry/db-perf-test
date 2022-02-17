const config = require('config');
const geoIP = require('geoip-lite');
const _ = require('lodash');
const onFinished = require('on-finished');
const log = require('../../utils/log');

const isProduction = config.get('app.environment') === 'production';
const isTest = config.get('app.environment') === 'test';

const getIpAddress = (req) => {
  const remoteAddress = _.get(req, 'connection.remoteAddress', '');
  let xRealIp = req.header('X-Real-IP');
  let xForwardedFor = req.header('X-Forwarded-For');

  // The real ip address should be the first item in the array of addresses
  // in the proxy chain for the SWS
  xRealIp = _.isString(xRealIp) ? xRealIp.split(', ')[0] : null;
  xForwardedFor = _.isString(xForwardedFor)
    ? xForwardedFor.split(', ')[0]
    : null;

  const ip = xRealIp || xForwardedFor || remoteAddress || '';
  const hybridIpv4Prefix = '::ffff:';
  return ip.startsWith(hybridIpv4Prefix)
    ? ip.replace(hybridIpv4Prefix, '')
    : ip;
};

const mapGeoLocation = (data) => {
  const geo = _.cloneDeep(data);
  const geoLocationSrc = _.get(geo, 'location', {});
  geo.location = {
    lat: _.get(geoLocationSrc, 'latitude'),
    lon: _.get(geoLocationSrc, 'longitude')
  };
  geo.meta = _.omit(geoLocationSrc, ['latitude', 'longitude']);

  return geo;
};

const getFormattedResponseTime = (xResponseTime) => {
  let formattedResponseTime = '?';

  if (_.isString(xResponseTime) && xResponseTime.endsWith('ms')) {
    const numericalResponseTime = Number(xResponseTime.replace('ms', ''));

    if (numericalResponseTime) {
      formattedResponseTime = Math.round(numericalResponseTime);
    }
  }

  return `${formattedResponseTime}ms`;
};

const requestLogger = () => (req, res, next) => {
  const timestamp = new Date().toISOString();
  const type = 'request';
  const { url } = req;
  const { method } = req;

  onFinished(res, async () => {
    const xResponseTime = res.getHeader('X-Response-Time');
    const responseTime = getFormattedResponseTime(xResponseTime);
    const status = res.statusCode;

    switch (true) {
      case isProduction:
        let userAgent = _.isPlainObject(_.get(req, 'useragent'))
          ? _.get(req, 'useragent')
          : {};
        userAgent = _.pick(userAgent, [
          'browser',
          'version',
          'os',
          'platform',
          'isMobile',
          'isTablet',
          'isDesktop'
        ]);

        const client = _.extend(userAgent, { ip: getIpAddress(req) });
        const geoData = geoIP.lookup(client.ip) || {};
        const geo = mapGeoLocation(geoData);
        log.info({
          client,
          geo,
          method,
          responseTime,
          status,
          timestamp,
          type,
          url
        });
        break;

      case !isTest:
        log.info(`${status} ${method} ${url} ${responseTime}`);
        break;

      default:
        break;
    }
  });

  next();
};

module.exports = requestLogger;
