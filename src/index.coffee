'use strict'
sizeof = require 'object-sizeof'
module.exports = (ndx) ->
  MAX_CACHE_SIZE = 1000
  cache = {}
  cacheSize = 0
  permissionsFn = (user) ->
    if user
      type: user.type
      role: user.role
    else
      type: 'server'
  hashObj = (obj) ->
    JSON.stringify obj
  resetAll = ->
    cache = {}
    cacheSize = 0
  ndx.cache =
    maxSize: (size) ->
      MAX_CACHE_SIZE = size
    permissionsFn: (fn) ->
      permissionsFn = fn
    set: (table, query, user, results) ->
      if cacheSize > MAX_CACHE_SIZE
        resetAll()
      if not cache[table]
        cache[table] =
          size: 0
      permissions = hashObj permissionsFn user
      if not cache[table][permissions]
        cache[table][permissions] = {}
      queryHash = hashObj query
      if not cache[table][permissions][queryHash]
        cache[table].size++
      cacheSize++
      cache[table][permissions][queryHash] = results
      return
    get: (table, query, user) ->
      permissions = hashObj permissionsFn user
      queryHash = hashObj query
      cache[table]?[permissions]?[queryHash]
    reset: (table) ->
      if cache[table]
        cacheSize -= cache[table].size
      cache[table] =
        size: 0
      return
    getLength: ->
      cacheSize
    getSizeBytes: ->
      sizeof cache