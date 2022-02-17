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
    const record = {
      ...data,
      _id: data.id
    };
    return await dbPerf.insert(record);
  } catch (error) {
    return error;
  }
};

const createMemberValidationsInPostgres = async (data) => {
  try {
    return await MemberValidationPg.create(data);
  } catch (error) {
    return error;
  }
};

const createMemberValidations = async (dbEngine, count = 1) => {
  for (let i = 0; i < count; i++) {
    const mvData = createMockMemberValidation();

    if (dbEngine === 'couch') {
      await createMemberValidationsInCouch(mvData);
    } else {
      await createMemberValidationsInPostgres(mvData);
    }
  }
};

module.exports = createMemberValidations;
