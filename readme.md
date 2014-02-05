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
Note that the MyService dependency should be added also as a string in an array after the constructor method.