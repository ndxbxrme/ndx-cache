(function() {
  'use strict';
  var sizeof;

  sizeof = require('object-sizeof');

  module.exports = function(ndx) {
    var MAX_CACHE_SIZE, cache, cacheSize, hashObj, permissionsFn, resetAll;
    MAX_CACHE_SIZE = 1000;
    cache = {};
    cacheSize = 0;
    permissionsFn = function(user) {
      if (user) {
        return {
          type: user.type,
          role: user.role
        };
      } else {
        return {
          type: 'server'
        };
      }
    };
    hashObj = function(obj) {
      return JSON.stringify(obj);
    };
    resetAll = function() {
      cache = {};
      return cacheSize = 0;
    };
    return ndx.cache = {
      maxSize: function(size) {
        return MAX_CACHE_SIZE = size;
      },
      permissionsFn: function(fn) {
        return permissionsFn = fn;
      },
      set: function(table, query, user, results) {
        var permissions, queryHash;
        if (cacheSize > MAX_CACHE_SIZE) {
          resetAll();
        }
        if (!cache[table]) {
          cache[table] = {
            size: 0
          };
        }
        permissions = hashObj(permissionsFn(user));
        if (!cache[table][permissions]) {
          cache[table][permissions] = {};
        }
        queryHash = hashObj(query);
        if (!cache[table][permissions][queryHash]) {
          cache[table].size++;
        }
        cacheSize++;
        cache[table][permissions][queryHash] = results;
      },
      get: function(table, query, user) {
        var permissions, queryHash, ref, ref1;
        permissions = hashObj(permissionsFn(user));
        queryHash = hashObj(query);
        return (ref = cache[table]) != null ? (ref1 = ref[permissions]) != null ? ref1[queryHash] : void 0 : void 0;
      },
      reset: function(table) {
        if (cache[table]) {
          cacheSize -= cache[table].size;
        }
        cache[table] = {
          size: 0
        };
      },
      getLength: function() {
        return cacheSize;
      },
      getSizeBytes: function() {
        return sizeof(cache);
      }
    };
  };

}).call(this);

//# sourceMappingURL=index.js.map
