const path = require('path');
const Sequelize = require('sequelize');
const Umzug = require('umzug');
const postgresDb = require('../../../utils/postgres-db');
const log = require('../../../utils/log');

const { DATE, STRING, UUID, UUIDV4 } = Sequelize;
const queryInterface = postgresDb.getQueryInterface();
const dataTypes = postgresDb.constructor;

const DbMigrations = postgresDb.define('db_migrations', {
  createdAt: {
    allowNull: false,
    defaultValue: new Date(),
    field: 'created_at',
    type: DATE
  },
  id: {
    defaultValue: UUIDV4,
    primaryKey: true,
    type: UUID
  },
  name: {
    allowNull: false,
    type: STRING
  },
  updatedAt: {
    allowNull: false,
    defaultValue: new Date(),
    field: 'updated_at',
    type: DATE
  }
});

const umzug = new Umzug({
  migrations: {
    params: [queryInterface, dataTypes, () => {}],
    path: path.join(__dirname, '/scripts'),
    pattern: /\.js$/
  },
  storage: 'sequelize',
  storageOptions: {
    model: DbMigrations,
    sequelize: postgresDb
  }
});

const run = async () => {
  try {
    const result = await umzug.up();
    const migrations = result.map((migration) => migration.file);

    let msg;
    if (migrations.length) {
      msg = `Successfully executed migrations: \n${migrations.join('\n')}`;
    } else {
      msg = 'No pending migrations to run. DB already up to date!';
    }

    log.info(msg);
    process.exit(0);
  } catch (error) {
    log.error(error);
    process.exit(1);
  }
};

run();
