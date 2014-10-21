(function (bruce, json, ko) {
  bruce.register('Saver', function (Window, Http) {
    var factory = this;
    factory.Create = function (options) {
      var self = this;
      var defaults = {
        url: '/change/me',
        exportCommand: function () { return {}; },
        isValid: function () { return true; },
        unsavedChangesMessage: 'There are unsaved changes.'
      };
      var settings = $.extend(defaults, options);
      self.lastSavedCommand = ko.observable(json.stringify(settings.exportCommand()));
      self.hasUnsavedChanges = ko.computed(function () {
        var currentCommand = json.stringify(settings.exportCommand());
        return currentCommand !== self.lastSavedCommand();
      });
      self.resetLastSavedCommand = function () {
        self.lastSavedCommand(json.stringify(settings.exportCommand()));
      };
      self.isPendingSave = ko.observable(false);
      self.save = function () {
        if (self.isPendingSave()) {
          return null;
        }
        if (!settings.isValid()) {
          return null;
        }
        document.body.style.cursor = 'wait';
        self.isPendingSave(true);
        var data = settings.exportCommand();
        var promise = Http.post(settings.url, data);
        promise.done(function () {
          self.resetLastSavedCommand();
        });
        promise.always(function () {
          self.isPendingSave(false);
          document.body.style.cursor = 'auto';
        });
        return promise;
      };
      $(window).bind('beforeunload', function () {
        if (self.hasUnsavedChanges() && !self.isPendingSave() && !window.sessionHasTimedOut) {
          return settings.unsavedChangesMessage;
        }
      });
    };
    return factory;
  }, ['Window', 'Http']);
})(window.bruce, JSON, ko);

(function ($, ko, bruce, undefined) {
  $(function () {
    var bound = $('[data-model]');
    for (var index = 0, count = bound.length; index < count; index++) {
      var $element = $(bound[index]);
      var modelName = $element.attr('data-model');
      var model = bruce.resolve(modelName);
      ko.applyBindings(model, bound[index]);
    }
    $('[data-cloak]').removeAttr('data-cloak');
  });
})(jQuery, ko, bruce);