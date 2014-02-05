bruce.register('TodoFactory', function(){
  var self = this;
  self.create = function(data){
    return {
      id: data.Id,
      complete: ko.observable(data.Complete),
      description: ko.observable(data.Description)
    };
  };
});