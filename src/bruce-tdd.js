(function (bruce, undefined) {
  var Promise = bruce.resolve("Promise");
  var MockService = function(name, callback) {
    var self = this;
    self.promise = new Promise();
    return self;
  };
  var http = {};
  http.getPromise = new Promise();
  http.getCalls = [];
  http.postPromise = new Promise();
  http.postCalls = [];
  http.get = function (url, data) {
    http.getCalls.push({
      url: url,
      data: data
    });
    return http.getPromise;
  };
  http.post = function(url, data) {
    http.postCalls.push({
      url: url,
      data: data
    });
    return http.postPromise;
  };
  http.reset = function() {
    http.getPromise = new Promise();
    http.postPromise = new Promise();
    http.getCalls = [];
    http.postCalls = [];
  };
  bruce.tdd = {
    MockService: MockService
  };
  bruce.erase('Http');
  bruce.inject('Http', http);

  var logger = {};
  logger.logged = [];
  logger.log = function(message) {
    logger.logged.push(message);
  };
  logger.reset = function() {
    logger.logged = [];
  };
  bruce.erase('Logger');
  bruce.inject('Logger', logger);

  var Window = {
    redirects: []
  };
  Window.redirect = function(url) {
    Window.redirects.push(url);
  };
  Window.reset = function() {
    Window.redirects = [];
  };
  bruce.erase('Window');
  bruce.inject('Window', Window);
})(bruce);