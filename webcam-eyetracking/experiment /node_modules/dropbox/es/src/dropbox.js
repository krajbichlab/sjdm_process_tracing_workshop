function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { UPLOAD, DOWNLOAD, RPC, APP_AUTH, TEAM_AUTH, USER_AUTH, NO_AUTH, COOKIE } from './constants.js';
import { routes } from '../lib/routes.js';
import DropboxAuth from './auth.js';
import { baseApiUrl, httpHeaderSafeJson } from './utils.js';
import { parseDownloadResponse, parseResponse } from './response.js';
var b64 = typeof btoa === 'undefined' ? function (str) {
  return Buffer.from(str).toString('base64');
} : btoa;
/**
 * @class Dropbox
 * @classdesc The Dropbox SDK class that provides methods to read, write and
 * create files or folders in a user or team's Dropbox.
 * @arg {Object} options
 * @arg {Function} [options.fetch] - fetch library for making requests.
 * @arg {String} [options.selectUser] - Select user is only used for team functionality.
 * It specifies which user the team access token should be acting as.
 * @arg {String} [options.pathRoot] - root path to access other namespaces
 * Use to access team folders for example
 * @arg {String} [options.selectAdmin] - Select admin is only used by team functionality.
 * It specifies which team admin the team access token should be acting as.
 * @arg {DropboxAuth} [options.auth] - The DropboxAuth object used to authenticate requests.
 * If this is set, the remaining parameters will be ignored.
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {Date} [options.accessTokenExpiresAt] - Date of the current access token's
 * expiration (if available)
 * @arg {String} [options.refreshToken] - A refresh token for retrieving access tokens
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 * @arg {String} [options.clientSecret] - The client secret for your app. Used to create
 * authentication URL and refresh access tokens.
 * @arg {String} [options.domain] - A custom domain to use when making api requests. This
 * should only be used for testing as scaffolding to avoid making network requests.
 * @arg {String} [options.domainDelimiter] - A custom delimiter to use when separating domain from
 * subdomain. This should only be used for testing as scaffolding.
 * @arg {Object} [options.customHeaders] - An object (in the form of header: value) designed to set
 * custom headers to use during a request.
 */

var Dropbox = /*#__PURE__*/function () {
  function Dropbox(options) {
    _classCallCheck(this, Dropbox);

    options = options || {};

    if (options.auth) {
      this.auth = options.auth;
    } else {
      this.auth = new DropboxAuth(options);
    }

    this.fetch = options.fetch || this.auth.fetch;
    this.selectUser = options.selectUser;
    this.selectAdmin = options.selectAdmin;
    this.pathRoot = options.pathRoot;
    this.domain = options.domain || this.auth.domain;
    this.domainDelimiter = options.domainDelimiter || this.auth.domainDelimiter;
    this.customHeaders = options.customHeaders || this.auth.customHeaders;
    Object.assign(this, routes);
  }

  _createClass(Dropbox, [{
    key: "request",
    value: function request(path, args, auth, host, style) {
      // scope is provided after "style", but unused in requests, so it's not in parameters
      switch (style) {
        case RPC:
          return this.rpcRequest(path, args, auth, host);

        case DOWNLOAD:
          return this.downloadRequest(path, args, auth, host);

        case UPLOAD:
          return this.uploadRequest(path, args, auth, host);

        default:
          throw new Error("Invalid request style: ".concat(style));
      }
    }
  }, {
    key: "rpcRequest",
    value: function rpcRequest(path, body, auth, host) {
      var _this = this;

      return this.auth.checkAndRefreshAccessToken().then(function () {
        var fetchOptions = {
          method: 'POST',
          body: body ? JSON.stringify(body) : null,
          headers: {}
        };

        if (body) {
          fetchOptions.headers['Content-Type'] = 'application/json';
        }

        _this.setAuthHeaders(auth, fetchOptions);

        _this.setCommonHeaders(fetchOptions);

        return fetchOptions;
      }).then(function (fetchOptions) {
        return _this.fetch(baseApiUrl(host, _this.domain, _this.domainDelimiter) + path, fetchOptions);
      }).then(function (res) {
        return parseResponse(res);
      });
    }
  }, {
    key: "downloadRequest",
    value: function downloadRequest(path, args, auth, host) {
      var _this2 = this;

      return this.auth.checkAndRefreshAccessToken().then(function () {
        var fetchOptions = {
          method: 'POST',
          headers: {
            'Dropbox-API-Arg': httpHeaderSafeJson(args)
          }
        };

        _this2.setAuthHeaders(auth, fetchOptions);

        _this2.setCommonHeaders(fetchOptions);

        return fetchOptions;
      }).then(function (fetchOptions) {
        return _this2.fetch(baseApiUrl(host, _this2.domain, _this2.domainDelimiter) + path, fetchOptions);
      }).then(function (res) {
        return parseDownloadResponse(res);
      });
    }
  }, {
    key: "uploadRequest",
    value: function uploadRequest(path, args, auth, host) {
      var _this3 = this;

      return this.auth.checkAndRefreshAccessToken().then(function () {
        var contents = args.contents;
        delete args.contents;
        var fetchOptions = {
          body: contents,
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': httpHeaderSafeJson(args)
          }
        };

        _this3.setAuthHeaders(auth, fetchOptions);

        _this3.setCommonHeaders(fetchOptions);

        return fetchOptions;
      }).then(function (fetchOptions) {
        return _this3.fetch(baseApiUrl(host, _this3.domain, _this3.domainDelimiter) + path, fetchOptions);
      }).then(function (res) {
        return parseResponse(res);
      });
    }
  }, {
    key: "setAuthHeaders",
    value: function setAuthHeaders(auth, fetchOptions) {
      // checks for multiauth and assigns auth based on priority to create header in switch case
      if (auth.split(',').length > 1) {
        var authTypes = auth.replace(' ', '').split(',');

        if (authTypes.includes(USER_AUTH) && this.auth.getAccessToken()) {
          auth = USER_AUTH;
        } else if (authTypes.includes(TEAM_AUTH) && this.auth.getAccessToken()) {
          auth = TEAM_AUTH;
        } else if (authTypes.includes(APP_AUTH)) {
          auth = APP_AUTH;
        }
      }

      switch (auth) {
        case APP_AUTH:
          if (this.auth.clientId && this.auth.clientSecret) {
            var authHeader = b64("".concat(this.auth.clientId, ":").concat(this.auth.clientSecret));
            fetchOptions.headers.Authorization = "Basic ".concat(authHeader);
          }

          break;

        case TEAM_AUTH:
        case USER_AUTH:
          if (this.auth.getAccessToken()) {
            fetchOptions.headers.Authorization = "Bearer ".concat(this.auth.getAccessToken());
          }

          break;

        case NO_AUTH:
        case COOKIE:
          break;

        default:
          throw new Error("Unhandled auth type: ".concat(auth));
      }
    }
  }, {
    key: "setCommonHeaders",
    value: function setCommonHeaders(options) {
      var _this4 = this;

      if (this.selectUser) {
        options.headers['Dropbox-API-Select-User'] = this.selectUser;
      }

      if (this.selectAdmin) {
        options.headers['Dropbox-API-Select-Admin'] = this.selectAdmin;
      }

      if (this.pathRoot) {
        options.headers['Dropbox-API-Path-Root'] = this.pathRoot;
      }

      if (this.customHeaders) {
        var headerKeys = Object.keys(this.customHeaders);
        headerKeys.forEach(function (header) {
          options.headers[header] = _this4.customHeaders[header];
        });
      }
    }
  }]);

  return Dropbox;
}();

export { Dropbox as default };