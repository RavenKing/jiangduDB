'use strict';
const application_id = process.env.APPLICATION_ID || 'SAP_HDI';
const hana_client = require('@sap/hana-client');
const logger = require('./logger');
const async = require('async');
const {prepareCredentials} = require('./utils');
const connections = require('./connections');

let vcap_application;

let space_name = '';
let org_name = '';

if (process.env.VCAP_APPLICATION) {
  vcap_application = JSON.parse(process.env.VCAP_APPLICATION);

  space_name = vcap_application.space_name || '';
  org_name = vcap_application.organization_name || '';
}

const APPLICATION = `${application_id}/${space_name}/${org_name}`;

/**
 * Add session variables like APPLICATION to the credentials.
 *
 * @param {any} credentials Bare credentials
 * @returns {Object} An enriched credentials object
 */
module.exports.enrich_credentials_with_session_variables = function (credentials = {}) {
  const enriched_creds = JSON.parse(JSON.stringify(credentials));
  enriched_creds['SESSIONVARIABLE:APPLICATION'] = APPLICATION;
  return enriched_creds;
};

module.exports.print_client_info = function (options, targetCreds, callback) {
  if (process.env.APPLICATION_VERSION_INFO) {
    logger.log(`Application version information: ${process.env.APPLICATION_VERSION_INFO}`);
  }
  const client = hana_client.createConnection();
  connections.push({client, file: __filename});

  const sql = 'select * from sys.m_session_context where CONNECTION_ID=CURRENT_CONNECTION';

  const hdiCreds = this.enrich_credentials_with_session_variables(prepareCredentials(targetCreds, options, logger));

  async.series([
    (cb) => client.connect(hdiCreds, cb),
    (cb) => client.exec(sql, cb)
  ], (error, [, session_context]) => {
    if (error) {
      logger.log(`Could not check if session variable APPLICATION is set correctly: ${error.message ? error.message : error}`);
    } else {
      const application = session_context.filter((r) => r.KEY === 'APPLICATION');
      if (application.length === 1) {
        logger.log(`Session variable APPLICATION is set to "${application[0].VALUE}".`);
      }
    }
    client.disconnect();
    return callback();
  });
};
