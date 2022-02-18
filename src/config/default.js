const { DEBUG, NODE_ENV } = process.env;

const config = {
  app: {
    debug: DEBUG === 'true',
    environment: NODE_ENV
  },
  db: {
    couchDb: {
      dbName: 'dbperf',
      domain: 'localhost',
      password: 'password',
      port: 5984,
      schema: 'http://',
      user: 'admin'
    },
    mongoDb: {
      dbName: 'dbperf',
      domain: 'localhost',
      password: 'password',
      port: 27017,
      schema: 'mongodb://',
      user: 'root'
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
