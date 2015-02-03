///<reference path="~/Scripts/QUnit/qunit.js"/>
///<reference path="~/Scripts/brucejs/bruce.js"/>
///javascriptlint

(function(bruce) {
    var tellStory = false;

    function tell(message) {
        if (!tellStory) {
            return;
        }
        console.log(message);
    }

    bruce.context = function(contextName, contextFunction) {
        document.title = contextName + " Tests";

        function getContext() {
            var context;
            context = {
                given: function(givenName, givenCallback) {
                    tell("Given " + givenName);
                    givenCallback(context.sut);
                },
                when: function(whenName, whenCallback) {
                    tell("When " + whenName);
                    whenCallback(context.sut);
                },
                then: {}
            };
            context.given.today_is = function(today) {
                Date = function(parseDate) {
                    if (typeof parseDate === "undefined") {
                        return new context.origDate(today);
                    }
                    return new context.origDate(parseDate);
                };
                //HACK: carry over stuff from Date and/or date.js
                Date.prototype = context.origDate.prototype;
                Date.length = context.origDate.length;
                Date.now = context.origDate.now;
                Date.parse = context.origDate.parse;
                Date.UTC = context.origDate.UTC;
                for (var property in context.origDate) {
                    if (context.origDate.hasOwnProperty(property)) {
                        //HACK: carry over stuff from Date and/or date.js
                        Date[property] = context.origDate[property];
                    }
                }
                for (var property2 in context.origDate.prototype) {
                    if (context.origDate.prototype.hasOwnProperty(property2)) {
                        //HACK: carry over stuff from Date and/or date.js
                        Date.prototype[property2] = context.origDate.prototype[property2];
                    }
                }
            };
            context.given.there_is_an_alert = function() {
                if (!Fortigent) {
                    Fortigent = {};
                }
                if (!Fortigent.UItweaks) {
                    Fortigent.UItweaks = {};
                }
                Fortigent.UItweaks.bruceAlert = function(message) {
                    context.bruceAlertMessage = message;
                };
            };
            context.given.there_is_a_confirm = function(isOkay) {
                $.fn.bruceConfirm = function (message, onOkCallback, dialogOptionsOverride, onCancelCallback) {
                    context.bruceConfirmMessage = message;
                    context.bruceConfirmOnOkCallback = onOkCallback;
                    context.bruceConfirmDialogOptionsOverride = dialogOptionsOverride;
                    context.bruceConfirmOnCancelCallback = onCancelCallback;
                    if (isOkay) {
                        if (onOkCallback) {
                            onOkCallback();
                        }
                    } else {
                        if (onCancelCallback) {
                            onCancelCallback();
                        }   
                    }
                };
                console.log($().bruceConfirm);
            };
            context.given.the_sut_was_in_the_state = function(stateSetup) {
                stateSetup(context.sut);
            };
            context.when.doing = function(doMethod) {
                doMethod(context.sut);
            };

            context._objectId = bruce.generateId();

            return context;
        }

        bruce.scenario = function(scenarioName, scenarioFunction, enableLogging) {
            var scenarioContext = getContext();
            module(contextName + ": " + scenarioName, {
                setup: function () {
                    try {

                        tell("====================================================");
                        $("#fakeDom").empty();
                        scenarioContext.origDate = Date;
                        scenarioContext.origAjax = $.ajax;
                        scenarioContext.ajaxRequest = null;
                        $.ajax = function(ajaxRequest) {
                            scenarioContext.ajaxRequest = ajaxRequest;
                        };
                        contextFunction(scenarioContext, scenarioContext.given, scenarioContext.when);
                        tell("Scenario " + scenarioName);
                        scenarioFunction(scenarioContext, scenarioContext.given, scenarioContext.when);

                    } catch (e) {
                        if(console && console.log)console.log(e);
                        throw 'Failed setting up scenario: ' + e;
                    }
                },
                teardown: function() {
                    try {
                        Date = scenarioContext.origDate;
                        $.ajax = scenarioContext.origAjax;
                        tell("====================================================");
                    } catch (e) {
                        throw 'Failed tearing down scenario: ' + e;
                    }
                }
            });
            bruce.then = function(testName, testFunction) {
                test(testName, function () {
                    tell("Then " + testName);
                    testFunction(scenarioContext, scenarioContext.sut, scenarioContext.result);
                });
            };
        };
    };
})(window.bruce);