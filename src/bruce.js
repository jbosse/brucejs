(function(window){
var Bruce = function(){
  var self = this;
  var locator = {};
  var dependencies = {};
  var resolved = {};
  self.register = function(name, ctor, inject, singleton){
    locator[name] = ctor;
    locator[name].singleton = (typeof(singleton)==='undefined')?true:singleton;
    dependencies[name] = inject;
  };
  self.resolve = function(name){
    if(resolved[name]&&locator[name].singleton){
      return resolved[name];
    }
    if(locator[name]){
      var construction = 'new locator["'+name+'"]('
      if(dependencies[name]){
        for(var index = 0, count = dependencies[name].length; index<count;index++){
          bruce.resolve(dependencies[name][index]);
          if(index>0){
            construction += ', ';
          }
          construction+='resolved["'+dependencies[name][index]+'"]';
        }
      }
      construction = construction + ');';
      resolved[name] = eval(construction);
      return resolved[name];
    }
    return null;
  };
};
window.bruce = new Bruce();
})(window);