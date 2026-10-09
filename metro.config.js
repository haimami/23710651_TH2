const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceModules = path.resolve('C:/RN/appcli/node_modules');

const config = {
  watchFolders: [
    projectRoot,
    workspaceModules,
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      workspaceModules,
    ],
    blockList: [
      /.*[/\\]android[/\\]\.cxx[/\\].*/,
      /.*[/\\]android[/\\]build[/\\].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
