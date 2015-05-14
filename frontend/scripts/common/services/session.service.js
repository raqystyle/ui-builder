'use strict';

var angular = require('angular');

/*@ngInject*/
function Service($http, $location, $route) {
  this._id = $route.current.params.sessionId;

  this.getCurrentSessionInitHTMLUrl = function() {
    return '/api/session/' + this._id + '/html';
  };

  this.getCurrentSessionAssetUrl = function(type) {
    return '/api/session/' + this._id + '/' + type;
  };

  this.getLatestSnapshot = function() {
    return $http.get('/api/session/' + this._id + '/snapshot/latest').then(function(resp) {
      return resp.data;
    });
  };

  this.startNew = function(title, initialSetup) {
    return $http.post('/api/session/new', {
      title: title,
      initialSetup: initialSetup
    }).then(function(resp) {
      if (angular.isObject(resp.data.data) && angular.isString(resp.data.data.sessionId)) {
        this._id = resp.data.data.sessionId;
        return $location.path('builder/' + resp.data.data.sessionId);
      }
    }.bind(this));
  };

  this.resetInitialCode = function(initial) {
    return $http.put('/api/session/' + this._id + '/initial', {initial: initial}).then(function(resp) {
      return resp.data.data;
    });
  };

  this.saveSnapshot = function(code) {
    return $http.post('/api/session/' + this._id + '/snapshot', {code: code});
  };

  this.continue = function(id) {
    this._id = id;
  };

}

module.exports = Service;
