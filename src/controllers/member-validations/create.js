const Chance = require('chance');
const couchDbUtils = require('../../utils/couch-db');
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

const createMemberValidationsInPostgres = async (data) => {
  try {
    return await MemberValidationPg.bulkCreate(data);
  } catch (error) {
    return error;
  }
};

const createMemberValidations = async (dbEngine, count = 1) => {
  if (dbEngine === 'couch') {
    const couchMvData = [];

    for (let i = 0; i < count; i++) {
      let record = createMockMemberValidation();
      record._id = chance.guid({ version: 4 });

      couchMvData.push(record);
    }

    await createMemberValidationsInCouch(couchMvData);
  } else {
    const postgresMvData = [];

    for (let i = 0; i < count; i++) {
      postgresMvData.push(createMockMemberValidation());
    }

    await createMemberValidationsInPostgres(postgresMvData);
  }
};

module.exports = createMemberValidations;
