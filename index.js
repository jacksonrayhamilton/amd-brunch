/* eslint-env node */
/* eslint-disable no-console */
/* global Promise */

'use strict';

var _ = require('lodash');
var allWriteTransforms = require('amodro-trace/write/all');
var amodroConfig = require('amodro-trace/config');
var amodroTrace = require('amodro-trace');
var fs = require('fs');
var path = require('path');

function read (file) {
  return fs.readFileSync(file, 'utf8');
}

// Translate an AMD id to a corresponding file name.
function idToFileName (id) {
  var fileName = id;
  if (/!/.test(fileName)) {
    var split = fileName.split('!');
    fileName = split[1];
  } else {
    fileName += '.js';
  }
  return fileName;
}

function Amd (config) {
  var plugin = this;
  if (!config) {
    config = {};
  }
  plugin.config = (config.plugins && config.plugins.amd) || {};
  plugin.config.baseUrl = plugin.config.baseUrl || '.';
  plugin.config.include = plugin.config.include || [];
  plugin.rootPath = config.paths.root;
}

// Trace module dependencies.
Amd.prototype._trace = function () {
  var plugin = this;

  if (plugin._tracePromise) {
    // Only trace once, as an optimization.
    return plugin._tracePromise;
  }

  var name = plugin.config.name;
  var include = plugin.config.include;
  var baseUrl = plugin.config.baseUrl;

  var rootPath = plugin.rootPath;
  var mainConfigFile = plugin.config.mainConfigFile;
  var buildConfig = plugin.config.buildConfig;
  var loaderConfig = {};

  include = [name].concat(include);
  var traced = [];

  // Accumulate standard and build configuration.
  if (mainConfigFile) {
    var configPath = path.join(rootPath, mainConfigFile);
    _.merge(loaderConfig, amodroConfig.find(read(configPath)));
  }
  if (buildConfig) {
    _.merge(loaderConfig, buildConfig);
  }

  function isVendorId (id) {
    // TODO: Maybe use actual vendor config.
    return /^node_modules/.test(id) && !(/!/).test(id);
  }

  function normalizePath (filePath) {
    // Resolve `node_modules` from the project root, rather than supposedly
    // from inside the baseUrl.
    return path.relative(path.join(rootPath, baseUrl), filePath);
  }

  // Override file handling logic so code may be organized more nicely.
  function handleFile (defaultHandler, id, filePath) {
    if (isVendorId(id)) {
      // Fix paths.
      return defaultHandler(id, normalizePath(filePath));
    }
    return defaultHandler(id, filePath);
  }

  function handleResult (result) {
    if (!_.find(traced, {id: result.id})) {
      if (isVendorId(result.id)) {
        // Fix paths.
        result.path = normalizePath(result.path);
      }
      // Convert dependencies to file names so Brunch can read them from disk.
      result.deps = _.map(result.deps || [], idToFileName);
      if (result.path === mainConfigFile) {
        // Update configuration to that of this build, since it might be
        // relevant for resolving modules.
        result.contents = amodroConfig.modify(result.contents, function (current) {
          return _.merge(current, buildConfig);
        });
      }
      traced.push(result);
    }
  }

  // Trace includes in order.
  plugin._tracePromise = _.reduce(include, function (prevPromise, id) {
    return prevPromise.then(function () {
      return amodroTrace({
        rootDir: path.join(rootPath, baseUrl),
        id: id,
        fileExists: handleFile,
        fileRead: handleFile,
        includeContents: true,
        writeTransform: allWriteTransforms()
      }, loaderConfig).then(function (traceResult) {
        _.forEach(traceResult.traced, handleResult);
        _.forEach(traceResult.warnings, function (warning) {
          console.warn(warning);
        });
        _.forEach(traceResult.errors, function (error) {
          console.error(error);
        });
      });
    });
  }, Promise.resolve()).then(function () {
    return traced;
  });

  return plugin._tracePromise;
};

Amd.prototype.include = function () {
  var plugin = this;
  return plugin._trace().then(function (traced) {
    return _.reduce(traced, function (inclusions, result) {
      if (/^node_modules/.test(result.path)) {
        return inclusions.concat(result.path);
      }
      return inclusions;
    }, []);
  });
};

Amd.prototype._tracePath = function (filePath) {
  var plugin = this;
  return plugin._trace().then(function (traced) {
    return _.find(traced, {path: filePath});
  });
};

Amd.prototype.getDependencies = function (fileData, filePath) {
  var plugin = this;
  return plugin._tracePath(filePath).then(function (result) {
    if (result) {
      return Promise.resolve(result.deps);
    } else {
      return Promise.reject(new Error('Could not find dependencies.'));
    }
  });
};

Amd.prototype.compile = function (file) {
  var plugin = this;
  return plugin._tracePath(file.path).then(function (result) {
    if (result) {
      return {
        path: result.path,
        data: result.contents
      };
    }
    return file;
  });
};

Amd.prototype.brunchPlugin = true;
Amd.prototype.type = 'javascript';
Amd.prototype.extension = 'js';
Amd.prototype.defaultEnv = 'production';

module.exports = Amd;
