/// javascriptlint
(function (window, $, undefined) {
    var Promise = function () {
        var self = this,
          isResolved,
          isRejected,
          done = [],
          fail = [],
          always = [];

        function fire(events, data1, data2, data3) {
            for (var index = 0, count = events.length; index < count; index++) {
                events[index](data1, data2, data3);
            }
        }

        self.resolve = function (data1, data2, data3) {
            fire(done, data1, data2, data3);
            fire(always);
            isResolved = {
                data1: data1,
                data2: data2,
                data3: data3
            };
        };
        self.reject = function (data1, data2, data3) {
            fire(fail, data1, data2, data3);
            fire(always);
            isRejected = {
                data1: data1,
                data2: data2,
                data3: data3
            };
        };
        self.done = function (callback) {
            done.push(callback);
            if (typeof isResolved !== 'undefined') {
                callback(isResolved.data1, isResolved.data2, isResolved.data3);
            }
            return self;
        };
        self.fail = function (callback) {
            fail.push(callback);
            if (typeof isRejected !== 'undefined') {
                callback(isRejected.data1, isRejected.data2, isRejected.data3);
            }
            return self;
        };
        self.always = function (callback) {
            always.push(callback);
            if (typeof isResolved !== 'undefined' || typeof isRejected !== 'undefined') {
                callback();
            }
            return self;
        };
        return self;
    };
    var Bruce = function () {
        var self = this;
        var locator = {};
        var dependencies = {};
        var config = {};
        var configs = [];
        var resolved = {};

        function isFunction(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        }

        self.generateId = function (separator) {
            var delim = separator || "-";

            function s4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            return (s4() + s4() + delim + s4() + delim + s4() + delim + s4() + delim + s4() + s4() + s4());
        };

        self.createNamespace = function (namespace) {
            return function (name) {
                return namespace + '.' + name;
            };
        };
        self.register = function (name, ctor, inject, singleton) {
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
        self.config = function (name, delegate, inject) {
            config[name] = delegate;
            configs.push(name);
            dependencies[name] = inject;
        };
        self.resolve = function (name) {
            if (resolved[name] && locator[name].singleton) {
                return resolved[name];
            }
            if (isFunction(locator[name])) {

                try {

                    var construction = 'new locator["' + name + '"](';
                    var localResolved = [];
                    if (dependencies[name]) {
                        for (var index = 0, count = dependencies[name].length; index < count; index++) {
                            var instance = bruce.resolve(dependencies[name][index]);
                            localResolved[dependencies[name][index]] = instance;

                            if (index > 0) {
                                construction += ', ';
                            }
                            if (instance === null) {
                                construction += 'null';
                            }
                            if (instance !== null) {
                                construction += 'localResolved["' + dependencies[name][index] + '"]';
                            }
                        }
                    }
                    construction = construction + ');';
                    var newObject = eval(construction);
                    newObject._objectId = self.generateId();
                    if (locator[name].singleton) {
                        newObject._singleton = true;
                    }

                    resolved[name] = newObject;

                    return newObject;
                 
                } catch (e) {
                    if (console && console.log) {
                      console.log(e);
                    }
                    throw 'Could not construct object: ' + e;
                }
            }
            if (locator[name]) {
                resolved[name] = locator[name];
                return resolved[name];
            }
            return null;
        };
        self.forget = function (name) {
            if (resolved[name]) {
                delete resolved[name];
            }
        };
        self.erase = function (name) {
            if (resolved[name]) {
                delete resolved[name];
            }
            if (locator[name]) {
                delete locator[name];
            }
        };

        self.dump = function (object) {
            if (!object._objectId) {
                console.log(object + ' is not a brucejs object');
            } else {
                var instanceType = object._singleton ? 'Singleton' : 'Instance';
                console.log(object._objectId + ' - ' + instanceType);
            }
            console.log(object);
        };

        function log(message) {
            if (window && window.console) {
                window.console.log(message);
            }
        }

        self.register('Window', function () {
            var _window = this;
            _window.redirect = function (url) {
                window.location = url;
            };
            return _window;
        });

        self.register('Logger', function () {
            var _logger = this;
            _logger.log = log;
            return _logger;
        });

        self.register('Http', function () {
            if ($ === undefined) {
                log('bruce.Http requires jQuery but jQuery was not loaded.');
            }
            var _post = this;
            _post.get = function (url, data) {
                return $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data)
                });
            };
            _post.post = function (url, data) {
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

        $(function () {
            executeConfigs();
        });
    };
    window.bruce = new Bruce();
})(window, jQuery);


(function (bruce, undefined) {
    bruce.make = function (typeName, argArray) {
        var ctor = bruce.resolve(typeName);
        function F() {
            return ctor.apply(this, argArray);
        }
        F.prototype = ctor.prototype;
        return new F();
    };

    function wrapCallback(callback, button, index) {
        if (typeof callback !== "undefined" && callback !== null) {
            return function () {
                callback(button, index);
                $(this).dialog("close");
            };
        }
        return function () {
            $(this).dialog("close");
        };
    }

    function buildButtons(view) {
        var buttons = {};
        for (var i = 0, c = view.buttons.length; i < c; i++) {
            var button = view.buttons[i];
            buttons[button.title] = wrapCallback(button.callback, button, i);
        }
        return buttons;
    }

    var AlertView = function (title, message) {
        this.title = title;
        this.message = message;
        this.buttons = [];
    };

    AlertView.prototype.addButton = function (buttonTitle, callback) {
        this.buttons.push({
            title: buttonTitle,
            callback: callback
        });
    };

    AlertView.prototype.show = function () {
        var settings = {
            title: this.title,
            buttons: buildButtons(this)
        };
        $().bruceConfirm(this.message, null, settings, null);
    };

    bruce.inject("AlertView", AlertView, [], false);
})(window.bruce);