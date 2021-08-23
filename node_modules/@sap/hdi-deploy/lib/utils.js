'use strict';


const fs = require('fs');
const paths = require('./paths.js');
const strip_json_comments = require('./json-comment-stripper');

/**
 * Remove duplicate messages - detect duplicated by their "id" property.
 *
 * @param {String[]} messages Array of messages
 * @returns {String[]} Array of messages without duplicates
 */
exports.dedupeMessagesById = function (messages) {
  const map = {};
  const dedupedMessages = [];

  const length = messages.length;

  for (let i = 0; i < length; i++) {
    const message = messages[i];
    if (!map[message.id]) {
      map[message.id] = true;
      dedupedMessages.push(message);
    }
  }

  return dedupedMessages;
};

/**
 * Read the given file. Strip comments from the file before parsing it as JSON.
 *
 * @param {String} filename File to read.
 * @returns {Object} The parsed file.
 */
exports.readJSONFile = function (filename) {
  const raw_stripped_file = strip_json_comments(fs.readFileSync(filename, 'utf8'));
  let file;

  try {
    file = JSON.parse(raw_stripped_file);
  } catch (error) {
    throw new Error(`Could not parse JSON file "${filename}": ${error}`);
  }

  return file;
};

/**
 * <a>.<b> turns into <a>"."<b>. This assumes that the outer "" will be added at a later stage.
 *
 * @param {any} name Name to quote.
 * @returns {String} Quoted name.
 */
function quote_dot (name) {
  const parts = name.split('.');
  if (parts.length > 2) {
    throw new Error(`There were multiple "." found in name "${name}". There can only be at most one ".".`);
  } else if (parts.length === 2) {
    name = `${parts[0]}"."${parts[1]}`;
  }
  return name;
}

exports.identifier = function (name) {
  // escape " inside identifiers to ""
  name = name.replace(/\"/g, '""');
  /*
   * Surround result with "..."
   */
  return `"${name}"`;
};

exports.dot_quoted_identifier = function (name) {
  // escape " inside identifiers to ""
  name = name.replace(/\"/g, '""');
  /*
   * Escape System privilege with a dot like a schema local role.
   * surround result with "..."
   */
  return `"${quote_dot(name)}"`;
};

exports.quote_dot_in_system_privilege_for_procedure = function (name) {
  const parts = name.split('.');
  if (parts.length === 2) {
    return `"${quote_dot(name)}"`;
  } else {
    return name;
  }
};

/*
 * Checks if variable is an Array.
 *
 * @param {any} variable Var to check.
 * @returns {boolean} True or false.
 */
function isArray (variable) {
  return (variable instanceof Array || Object.prototype.toString.call(variable) === '[object Array]');
}

exports.isArray = isArray;

/**
 * Checks if the given file is a hdbsynonymgrantor or hdbgrants file.
 *
 * @param {String} file File to check.
 * @returns {boolean} True if it's a grantor file.
 */
function isGrantorFile (file) {
  const ext = paths.extname(file);
  if (ext !== '') {
    return ext === '.hdbsynonymgrantor' || ext === '.hdbgrants';
  } else {
    const base = paths.basename(file);
    return base === '.hdbgrants';
  }
}
exports.isGrantorFile = isGrantorFile;

/**
 * Checks if the given file is a hdbsynonymgrantor or hdbgrants file.
 *
 * @param {String} file File to check.
 * @returns {boolean} True if it's a grantor file.
 */
function isRevokerFile (file) {
  const ext = paths.extname(file);
  if (ext !== '') {
    return ext === '.hdbrevokes';
  } else {
    const base = paths.basename(file);
    return base === '.hdbrevokes';
  }
}
exports.isRevokerFile = isRevokerFile;

/**
 * Check if the file is deployable.
 * This is used to filter out non-deployable files.
 *
 * @param {String} file File to check.
 * @returns {boolean} True if the file is deployable.
 */
function isDeployableFile (file) {
  return !isGrantorFile(file) && !isRevokerFile(file);
}

exports.isDeployableFile = isDeployableFile;

/**
 * Check if the file is a .hdbsynonymtemplate file.
 *
 * @param {String} file The name of the file
 * @returns {boolean} True if it's a .hdbsynonymtemplate file.
 */
function isSynonymTemplateFile (file) {
  return paths.extname(file) === '.hdbsynonymtemplate';
}

exports.isSynonymTemplateFile = isSynonymTemplateFile;

/**
 * Check if the file is a .hdbsynonymconfig file.
 *
 * @param {String} file The name of the file
 * @returns {boolean} True if it's a .hdbsynonymconfig file.
 */
function isSynonymConfigFile (file) {
  return paths.extname(file) === '.hdbsynonymconfig';
}

exports.isSynonymConfigFile = isSynonymConfigFile;

/**
 * Build the filename of the hdbsynonymconfig file for a given hdbsynonymtemplate file.
 *
 * @param {any} file The name of the hdbsynonymtemplate
 * @returns {String} The hdbsynonymconfig filename.
 */
exports.rename_synonymtemplate_to_config = function (file) {
  return paths.serverPath(paths.join(paths.dirname(file), `${paths.basename(file, '.hdbsynonymtemplate')}.hdbsynonymconfig`));
};

/**
 * Obfuscate a string by replacing the middle part with [..].
 *
 * @param {any} string String to obfuscate
 * @param {Number} obfuscation_factor Percentage of characters to leave intact at the beginning and end.
 *
 * @returns {String} Obfuscated string.
 */
function censor_string (string, obfuscation_factor) {
  const length = string.length;
  const leave_intact = Math.floor(length * obfuscation_factor / 2);
  // eslint-disable-next-line no-console
  console.assert(leave_intact > 0);

  const start = string.substr(0, leave_intact);
  const end = string.substr(string.length - leave_intact, string.length);
  const final = `${start}[..]${end}`;
  // eslint-disable-next-line no-console
  console.assert(final !== string, 'Failed to censor the string!');
  return final;
}

exports.censor_string = censor_string;

/**
 * Generates current date and time
 *
 * @returns {String} current date and time.
 */

function currentDateTime () {
  const date_ob = new Date();
  const date = (`0${date_ob.getDate()}`).slice(-2);
  const month = (`0${date_ob.getMonth() + 1}`).slice(-2);
  const year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  if (hours<=9)
    hours = `0${hours}`;
  let minutes = date_ob.getMinutes();
  if (minutes<=9)
    minutes = `0${minutes}`;
  let seconds = date_ob.getSeconds();
  if (seconds<=9)
    seconds = `0${seconds}`;
  const datetime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  return datetime;
}

exports.currentDateTime = currentDateTime;

/**
 * Create a container object with the supplied credentials.
 *
 * @param {any} creds Credentials for the container.
 * @param {any} options Options, that can contain credentials as well.
 * @returns {Object} An object containing the credentials for a HANA connection.
 */
function prepareCredentials (creds, options, logger) {
  const hdiCreds = {
    user: creds.hdi_user ? creds.hdi_user : creds.user,
    password: creds.hdi_user ? creds.hdi_password : creds.password
  };

  if (creds.client_authentication_private_key) {
    hdiCreds.key = creds.client_authentication_private_key;
    logger.trace(`hdiCreds.key set to '${censor_string(hdiCreds.key, 0.05)}'`);
  }

  if (creds.client_authentication_certificate) {
    hdiCreds.cert = creds.client_authentication_certificate;
    logger.trace(`hdiCreds.cert set to '${hdiCreds.cert}'`);
  }

  if (Array.isArray(creds.db_hosts)) {
    hdiCreds.hosts = creds.db_hosts.map(entry => {
      if (entry.port) {
        entry.port = `${entry.port}`;
      }

      return entry;
    });
  } else {
    hdiCreds.host = creds.host;
    // hana-client@2.7.16 requires this to be a string.
    hdiCreds.port = `${creds.port}`;
  }

  if (creds.certificate) {
    hdiCreds.ca = Array.isArray(creds.certificate) ? creds.certificate : [creds.certificate];
    logger.trace('hdiCreds.ca set to', hdiCreds.ca);
  }

  if (creds.hostname_in_certificate) {
    hdiCreds.sslHostNameInCertificate = creds.hostname_in_certificate;
    logger.trace('hdiCreds.sslHostNameInCertificate set to', hdiCreds.sslHostNameInCertificate);
  }
  // boolean
  if (creds.validate_certificate !== undefined && creds.validate_certificate !== null) {
    hdiCreds.sslValidateCertificate = creds.validate_certificate;
    logger.trace('hdiCreds.sslValidateCertificate set to', hdiCreds.sslValidateCertificate);
  }
  // boolean
  if (creds.encrypt !== undefined && creds.encrypt !== null) {
    hdiCreds.encrypt = creds.encrypt;
    logger.trace('hdiCreds.encrypt set to', hdiCreds.encrypt);
  }
  hdiCreds.initializationTimeout = options.connectionTimeout;
  return hdiCreds;
}
exports.prepareCredentials = prepareCredentials;

/**
 * Run the given $fn, expecting to call the $callback at the end. If execution is not done in $timeout milliseconds,
 * call the callback with an error - Timeout of $timeout reached.
 *
 * @param {Function} fn Function to call, taking callback as the first and only argument
 * @param {Function} callback Standard (error, result) callback
 * @param {Integer} timeout Timeout after which to call the callback with an error
 */
function callbackTimeout (fn, callback, timeout, timeoutName='Timeout') {
  let callbackCalled = false;
  let timeoutReached = false;

  const timer = setTimeout(() => {
    if (!callbackCalled) {
      timeoutReached = true;
      return callback(new Error(`${timeoutName} of ${timeout}ms reached!`));
    }
  }, timeout);

  fn((e, r) => {
    if (!timeoutReached) {
      clearTimeout(timer);
      callbackCalled = true;
      return callback(e, r);
    }
  });
}

exports.callbackTimeout = callbackTimeout;
