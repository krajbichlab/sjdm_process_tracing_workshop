import { DEFAULT_API_DOMAIN, DEFAULT_DOMAIN, TEST_DOMAIN_MAPPINGS } from './constants';

function getSafeUnicode(c) {
  var unicode = "000".concat(c.charCodeAt(0).toString(16)).slice(-4);
  return "\\u".concat(unicode);
}

export var baseApiUrl = function baseApiUrl(subdomain) {
  var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_API_DOMAIN;
  var domainDelimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';

  if (!domainDelimiter) {
    return "https://".concat(domain, "/2/");
  }

  if (domain !== DEFAULT_API_DOMAIN && TEST_DOMAIN_MAPPINGS[subdomain] !== undefined) {
    subdomain = TEST_DOMAIN_MAPPINGS[subdomain];
    domainDelimiter = '-';
  }

  return "https://".concat(subdomain).concat(domainDelimiter).concat(domain, "/2/");
};
export var OAuth2AuthorizationUrl = function OAuth2AuthorizationUrl() {
  var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_DOMAIN;

  if (domain !== DEFAULT_DOMAIN) {
    domain = "meta-".concat(domain);
  }

  return "https://".concat(domain, "/oauth2/authorize");
};
export var OAuth2TokenUrl = function OAuth2TokenUrl() {
  var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_API_DOMAIN;
  var domainDelimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
  var subdomain = 'api';

  if (domain !== DEFAULT_API_DOMAIN) {
    subdomain = TEST_DOMAIN_MAPPINGS[subdomain];
    domainDelimiter = '-';
  }

  return "https://".concat(subdomain).concat(domainDelimiter).concat(domain, "/oauth2/token");
}; // source https://www.dropboxforum.com/t5/API-support/HTTP-header-quot-Dropbox-API-Arg-quot-could-not-decode-input-as/m-p/173823/highlight/true#M6786

export function httpHeaderSafeJson(args) {
  return JSON.stringify(args).replace(/[\u007f-\uffff]/g, getSafeUnicode);
}
export function getTokenExpiresAtDate(expiresIn) {
  return new Date(Date.now() + expiresIn * 1000);
}
/* global WorkerGlobalScope */

export function isWindowOrWorker() {
  return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope // eslint-disable-line no-restricted-globals
  || typeof module === 'undefined' || typeof window !== 'undefined';
}
export function isBrowserEnv() {
  return typeof window !== 'undefined';
}
export function isWorkerEnv() {
  return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope; // eslint-disable-line no-restricted-globals
}
export function createBrowserSafeString(toBeConverted) {
  var convertedString = toBeConverted.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return convertedString;
}