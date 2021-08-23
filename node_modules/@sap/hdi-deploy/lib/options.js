'use strict';


const PathFilter = require('./filters/PathFilter');

module.exports = function () {
  return {
    root: process.env.ROOT || process.cwd(),
    deployDirs: ['src/', 'cfg/'],
    autoUndeploy: false,
    exit: false,
    detectServerVersion: true,
    lockContainer: undefined,
    lockContainerTimeout: 2 * 60 * 1000,
    workingSet: new PathFilter(),
    includeFilter: new PathFilter(),
    excludeFilter: new PathFilter(),
    deploy: new PathFilter(),
    treatUnmodifiedAsModified: false,
    undeploy: new PathFilter(),
    parameters: {},
    path_parameters: {},
    treatWarningsAsErrors: false,
    validateExternalDependencies: false,
    simulateMake: false,
    stripCRFromCSV: false,
    singleDeleteCallsForDirectories: true,
    undeployFilename: 'undeploy.json',
    verbose: true,
    logFile: undefined,
    connectionTimeout: 10 * 1000,
    treatWrongOwnershipAsErrors: false,
    migrationTableDevMode: false,
    detectContainerAPIVersion: true,
    detectHDIVersion: true,
    liveness_ping: true,
    live_messages: true,
    writeTimeout: 15* 60 * 1000,
    deleteTimeout: 15 * 60 * 1000,
  };
};
