"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RPC = exports.RPC = 'rpc';
var UPLOAD = exports.UPLOAD = 'upload';
var DOWNLOAD = exports.DOWNLOAD = 'download';
var APP_AUTH = exports.APP_AUTH = 'app';
var USER_AUTH = exports.USER_AUTH = 'user';
var TEAM_AUTH = exports.TEAM_AUTH = 'team';
var NO_AUTH = exports.NO_AUTH = 'noauth';
var COOKIE = exports.COOKIE = 'cookie';
var DEFAULT_API_DOMAIN = exports.DEFAULT_API_DOMAIN = 'dropboxapi.com';
var DEFAULT_DOMAIN = exports.DEFAULT_DOMAIN = 'dropbox.com';
var TEST_DOMAIN_MAPPINGS = exports.TEST_DOMAIN_MAPPINGS = {
  api: 'api',
  notify: 'bolt',
  content: 'api-content'
};