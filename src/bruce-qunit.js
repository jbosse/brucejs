(function (bruce, $) {
  bruce.context = function(contextName, contextFunction) {
    var context;
    document.title = contextName + " Tests";
    context = {
      given: function(givenName, givenCallback) {
        givenCallback(context.sut);
      },
      when: function (whenName, whenCallback) {
        whenCallback(context.sut);
      },
      then: {}
    };
    context.given.today_is = function (today) {
      Date = function(parseDate) {
        if (typeof parseDate === "undefined") {
          return new context.origDate(today);
        }
        return new context.origDate(parseDate);
      };
    };
    context.given.the_sut_was_in_the_state = function(stateSetup) {
      stateSetup(context.sut);
    };
    context.when.doing = function(doMethod) {
      doMethod(context.sut);
    };
    bruce.contextName = contextName;
    bruce.contextFunction = contextFunction;
    bruce.scenario = function(scenarioName, scenarioFunction, enableLogging) {
      module(bruce.contextName + ": " + scenarioName, {
        setup: function () {
          $("#fakeDom").empty();
          context.origDate = Date;
          context.origAjax = $.ajax;
          context.ajaxRequest = null;
          $.ajax = function(ajaxRequest){
            context.ajaxRequest = ajaxRequest;
          };
          bruce.contextFunction(context, context.given, context.when);
          scenarioFunction(context, context.given, context.when);
        },
        teardown: function() {
          Date = context.origDate;
          $.ajax = context.origAjax;
        }
      });
      bruce.then = function (testName, testFunction) {
        test(testName, function () {
          testFunction(context, context.sut, context.result);
        });
      };
    };
  };
})(window.bruce, jQuery);