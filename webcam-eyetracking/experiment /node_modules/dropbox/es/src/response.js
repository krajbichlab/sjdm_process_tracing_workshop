function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { isWindowOrWorker } from './utils.js';
import { DropboxResponseError } from './error.js';
export var DropboxResponse = function DropboxResponse(status, headers, result) {
  _classCallCheck(this, DropboxResponse);

  this.status = status;
  this.headers = headers;
  this.result = result;
};

function throwAsError(res) {
  return res.text().then(function (data) {
    var errorObject;

    try {
      errorObject = JSON.parse(data);
    } catch (error) {
      errorObject = data;
    }

    throw new DropboxResponseError(res.status, res.headers, errorObject);
  });
}

export function parseResponse(res) {
  if (!res.ok) {
    return throwAsError(res);
  }

  return res.text().then(function (data) {
    var responseObject;

    try {
      responseObject = JSON.parse(data);
    } catch (error) {
      responseObject = data;
    }

    return new DropboxResponse(res.status, res.headers, responseObject);
  });
}
export function parseDownloadResponse(res) {
  if (!res.ok) {
    return throwAsError(res);
  }

  return new Promise(function (resolve) {
    if (isWindowOrWorker()) {
      res.blob().then(function (data) {
        return resolve(data);
      });
    } else {
      res.buffer().then(function (data) {
        return resolve(data);
      });
    }
  }).then(function (data) {
    var result = JSON.parse(res.headers.get('dropbox-api-result'));

    if (isWindowOrWorker()) {
      result.fileBlob = data;
    } else {
      result.fileBinary = data;
    }

    return new DropboxResponse(res.status, res.headers, result);
  });
}