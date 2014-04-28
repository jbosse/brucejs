/// javascriptlint
(function (window, $, undefined) {
  var Promise = function() {
    var self = this,
      isResolved,
      isRejected,
      done = [],
      fail = [],
      always = [];

    function fire(events, data) {
      for (var index = 0, count = events.length; index < count; index++) {
        events[index](data);
      }
    }

    self.resolve = function(data) {
      fire(done, data);
      fire(always);
      isResolved = data;
    };
    self.reject = function(message) {
      fire(fail, message);
      fire(always);
      isRejected = message;
    };
    self.done = function(callback) {
      done.push(callback);
      if (typeof isResolved !== 'undefined') {
        callback(isResolved);
      }
      return self;
    };
    self.fail = function(callback) {
      fail.push(callback);
      if (typeof isRejected !== 'undefined') {
        callback(isRejected);
      }
      return self;
    };
    self.always = function(callback) {
      always.push(callback);
      if (typeof isResolved !== 'undefined' || typeof isRejected !== 'undefined') {
        callback();
      }
      return self;
    };
    return self;
  };
  var Bruce = function() {
    var self = this;
    var locator = {};
    var dependencies = {};
    var config = {};
    var configs = [];
    var resolved = {};

    function isFunction(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    self.register = function(name, ctor, inject, singleton) {
      locator[name] = ctor;
      resolved[name] = null;
      locator[name].singleton = (typeof (singleton) === 'undefined') ? true : singleton;
      dependencies[name] = inject;
    };
    self.inject = function (name, obj) {
      locator[name] = {
        singleton: true
      };
      resolved[name] = obj;
    };
    self.config = function(name, delegate, inject) {
      config[name] = delegate;
      configs.push(name);
      dependencies[name] = inject;
    };
    self.resolve = function (name) {
      if (resolved[name] && locator[name].singleton) {
        return resolved[name];
      }
      if (isFunction(locator[name])) {
        var construction = 'new locator["' + name + '"](';
        if (dependencies[name]) {
          for (var index = 0, count = dependencies[name].length; index < count; index++) {
            var instance = bruce.resolve(dependencies[name][index]);
            if (index > 0) {
              construction += ', ';
            }
            if (instance === null) {
              construction += 'null';
            }
            if (instance !== null) {
              construction += 'resolved["' + dependencies[name][index] + '"]';
            }
          }
        }
        construction = construction + ');';
        resolved[name] = eval(construction);
        return resolved[name];
      }
      if (locator[name]) {
        resolved[name] = locator[name];
        return resolved[name];
      }
      return null;
    };
    self.forget = function(name) {
      if (resolved[name]) {
        delete resolved[name];
      }
    };
    self.erase = function(name) {
      if (resolved[name]) {
        delete resolved[name];
      }
      if (locator[name]) {
        delete locator[name];
      }
    };

    function log(message) {
      if (window && window.console) {
        window.console.log(message);
      }
    }

    self.register('Window', function() {
      var _window = this;
      _window.redirect = function(url) {
        window.location = url;
      };
      return _window;
    });

    self.register('Logger', function() {
      var _logger = this;
      _logger.log = log;
      return _logger;
    });

    self.register('Http', function() {
      if ($ === undefined) {
        log('bruce.Http requires jQuery but jQuery was not loaded.');
      }
      var _post = this;
      _post.get = function(url, data) {
        return $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(data)
        });
      };
      _post.post = function(url, data) {
        return $.ajax({
          url: url,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(data)
        });
      };
      return _post;
    });

    self.inject("Promise", Promise);

    function executeConfigs() {
      for (var configIndex = 0, configCount = configs.length; configIndex < configCount; configIndex++) {
        var name = configs[configIndex];
        var delegate = config[name];
        var inject = dependencies[name];
        if (!isFunction(delegate)) {
          log('The provided config "' + name + '" is not a function. Config delegates need to be functions.');
          return;
        }
        var executor = 'config["' + name + '"](';
        if (inject) {
          for (var dependneciesIndex = 0, dependneciesCount = dependencies[name].length; dependneciesIndex < dependneciesCount; dependneciesIndex++) {
            var instance = self.resolve(dependencies[name][dependneciesIndex]);
            if (dependneciesIndex > 0) {
              executor += ', ';
            }
            if (instance === null) {
              executor += 'null';
            }
            if (instance !== null) {
              executor += 'resolved["' + dependencies[name][dependneciesIndex] + '"]';
            }
          }
        }
        executor = executor + ');';
        eval(executor);
      }
    }

    $(function() {
      executeConfigs();
    });
  };
  window.bruce = new Bruce();
})(window, jQuery);