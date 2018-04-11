const { PeopleHelpers } = require("./peopleHelpers.js");

const PeopleJobs = {
  "people.updateFBUsers": {
    run({ job }) {
      logger.debug("people.updateFBUsers job: called");
      check(job && job.data && job.data.campaignId, String);
      check(job && job.data && job.data.facebookAccountId, String);
      const campaignId = job.data.campaignId;
      const facebookAccountId = job.data.facebookAccountId;
      let errored = false;
      try {
        PeopleHelpers.updateFBUsers({
          campaignId,
          facebookAccountId
        });
      } catch (error) {
        errored = true;
        return job.fail(error.message);
      } finally {
        if (!errored) {
          job.done();
          return job.remove();
        }
      }
    },

    workerOptions: {
      concurrency: 2,
      pollInterval: 2500
    },

    jobOptions() {
      const options = {
        retry: {
          retries: 10,
          wait: 10 * 60 * 1000
        }
      };
      return options;
    }
  }
};

exports.PeopleJobs = PeopleJobs;
