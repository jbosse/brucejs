///<reference path="~/Scripts/brucejs/bruce.js"/>
///javascriptlint

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

(function (bruce, json, ko) {
  bruce.erase('Saver');
  bruce.register('Saver', function (Promise) {
    var factory = this;
    factory.Create = function(options) {
      var self = this;
      var defaults = {
        url: '/change/me',
        exportCommand: function() { return {}; },
        isValid: function() { return true; },
        unsavedChangesMessage: 'There are unsaved changes.'
      };
      self.settings = $.extend(defaults, options);
      self.saves = 0;
      self.saveSucceeds = true;
      self.saveReturns = {};
      self.lastSavedCommand = ko.observable(json.stringify(self.settings.exportCommand()));
      self.hasUnsavedChanges = ko.computed(function() {
        var currentCommand = json.stringify(self.settings.exportCommand());
        return currentCommand !== self.lastSavedCommand();
      });
      self.resetLastSavedCommand = function() {
        self.lastSavedCommand(json.stringify(self.settings.exportCommand()));
      };
      self.isPendingSave = ko.observable(false);
      self.save = function() {
        var promise = new Promise();
        self.saves++;
        if (self.saveSucceeds) {
          self.resetLastSavedCommand();
          promise.resolve(self.saveReturns);
        } else {
          promise.reject(self.saveReturns);
        }
        return promise;
      };
    };
    return factory;
  }, ['Promise']);
})(window.bruce, JSON, ko);

(function (bruce) {
  /*
  This method overrides the make factory to spy on calls made to it
  */
  var internalMake = bruce.make;

  var ctor = 

  bruce.make = function (typeName, argArray) {
    if (typeof bruce.make.made === "undefined") {
      bruce.make.made = {};
    }
    if (typeof bruce.make.made[typeName] === "undefined") {
      bruce.make.made[typeName] = [];
    }
    var result = internalMake(typeName, argArray);
    bruce.make.made[typeName].push({ typeName: typeName, argArray: argArray, result: result });
    return result;
  };

  bruce.make.reset = function () {
    bruce.make.made = {};
  };
})(window.bruce);

(function(bruce) {
  bruce.erase("AlertView");
  var AlertView = function (title, message) {
    this.title = title;
    this.message = message;
    this.shown = 0;
    this.buttons = [];
  };

  AlertView.prototype.addButton = function (buttonTitle, callback) {
    this.buttons.push({
      title: buttonTitle,
      callback: callback
    });
  };

  AlertView.prototype.show = function () {
    this.shown++;
  };

  AlertView.prototype.clickButtonAtIndex = function (index) {
    if (index > this.buttons.length - 1) {
      console.log("Invalid index: " + index);
      return;
    }
    this.buttons[index].callback(this.buttons[index], index);
  };

  AlertView.prototype.buttonTitleAtIndex = function (index) {
    if (index > this.buttons.length - 1) {
      console.log("Invalid index: " + index);
      return "Invalid index.";
    }
    return this.buttons[index].title;
  };

  bruce.inject("AlertView", AlertView, [], false);

})(window.bruce);