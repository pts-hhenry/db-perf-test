const Chance = require('chance');
const couchDbUtils = require('../../utils/couch-db');
const MemberValidationMongo = require('../../models/mongo/member-validation-schema');
const MemberValidationPg = require('../../models/postgres/member-validation-schema');

const chance = new Chance();

const createMockMemberValidation = () => {
  return {
    accountStatus: chance.string({
      alpha: true,
      length: 20
    }),
    email: chance.email({ domain: 'dbperf.points.com' }),
    firstName: chance.first(),
    isEmailVerified: chance.bool(),
    lastName: chance.last(),
    randomId: chance.guid({ version: 4 })
  };
};

const createMemberValidationsInCouch = async (data) => {
  try {
    const dbPerf = couchDbUtils.use('dbperf');
    return await dbPerf.bulk({ docs: data });
  } catch (error) {
    return error;
  }
};

const createMemberValidationsInMongo = async (data) => {
  try {
    return await MemberValidationMongo.insertMany(data);
  } catch (error) {
    return error;
  }
};

const createMemberValidationsInPostgres = async (data) => {
  try {
    return await MemberValidationPg.bulkCreate(data);
  } catch (error) {
    return error;
  }
};

const createMemberValidations = async (dbEngine, count = 1) => {
  switch (dbEngine) {
    case 'couch':
      const couchMvData = [];

      for (let i = 0; i < count; i++) {
        let record = createMockMemberValidation();
        record._id = chance.guid({ version: 4 });

        couchMvData.push(record);
      }

      await createMemberValidationsInCouch(couchMvData);
      break;

    case 'mongo':
      const mongoMvData = [];

      for (let i = 0; i < count; i++) {
        let record = createMockMemberValidation();
        record._id = chance.guid({ version: 4 });

        mongoMvData.push(record);
      }

      await createMemberValidationsInMongo(mongoMvData);
      break;

    case 'postgres':
    default:
      const postgresMvData = [];

      for (let i = 0; i < count; i++) {
        postgresMvData.push(createMockMemberValidation());
      }

      await createMemberValidationsInPostgres(postgresMvData);
      break;
  }
};

module.exports = createMemberValidations;
