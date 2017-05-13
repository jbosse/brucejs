# Bruce.js #
bruce.js and bruce-ko.js are two small utility libraries to make working with complex Knockout view models a little easier.

## Usage ##
For dependency injection, you only need bruce.js  
```  
    <script src="bruce.js"></script>
```  

Register your constructor methods with bruce.  
```  
    <script>
        bruce.register('MyClass', function(){
            var self = this;
            self.sayHello = function(){
                alert('Hello');
            };
        });
    </script>
```  

Resolve your class as a singleton.  
```
    var myClass = bruce.resolve('MyClass');
```  

In order to use dependency injection:  
```  
    bruce.register('MyService', function(){
        var self = this;
        self.doWork = function(){
            console.log('doing work');
        };
    });
    bruce.register('MyModel', function(MyService){
        var self = this;
        self.items = MyService.doWork();
    },['MyService']);
```  

**Configuration**  
You can add configuration code to execute on document ready. For example to use ko.validation extenders you would add a config:
```  
    bruce.config('MyConfig', function (Logger) {
      ko.validation.configure({ registerExtenders: true, messagesOnModified: true, insertMessages: false });
    }, ['Logger']);
````  

**Special Registrations**  
There are a few pre-registered objects that you can inject as dependencies  
 -  *Window*: A wrapper around window that currently supports ```Window.redirect(url);```  
 -  *Logger*: A wrapper around console.log ```Logger.log(message);```  
 -  *Http*: A wrapper for jQuery ajax methods. Currently only supports ```Http.post(url, data)``` and returns the underlying jQuery promise.(requires jQuery)  
 -  *Promise*: A standard promise pattern object.  

Note that the MyService dependency should be added also as a string in an array after the constructor method.

## Bruce-tdd.js ##
This is a helper library to aid with unit testing by hijacking Window, Logger, and Http with some simple mocks. More documentation is needed in this readme but the src is fairly easy to understand.

## Bruce-qunit.js ##
This is an experimental library for users of qunit. It is a thin wrapper around modules and tests to help with a more BDD style of tests. A sample set of tests can be found in the examples, but again better documentation is needed.
ending
