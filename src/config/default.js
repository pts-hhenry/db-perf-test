const { DEBUG, NODE_ENV } = process.env;

const config = {
  app: {
    debug: process.env.DEBUG === 'true',
    environment: NODE_ENV
  },
  db: {
    couchDb: {
      baseDomain: 'localhost',
      dbName: 'dbperf',
      password: 'password',
      port: 5984,
      requestDefaults: {
        proxy: {
          protocol: 'http',
          host: 'myproxy.net'
        },
        headers: {
          customheader: 'MyCustomHeader'
        }
      },
      schema: 'http://',
      user: 'admin'
    },
    postgres: {
      name: 'dbperf',
      options: {
        define: {
          freezeTableName: true,
          timestamps: false
        },
        dialect: 'postgres',
        host: 'localhost',
        logging: false,
        pool: {
          acquire: 30000,
          idle: 10000,
          max: 5,
          min: 0
        },
        port: 5432
      },
      pass: 'secret',
      user: 'postgres'
    }
  }
};

module.exports = config;
