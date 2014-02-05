bruce.register('TodoService',function(TodoFactory){
  var self = this;
  self.query = function(){
    var result = [],
      data = [
      { Id: 1, Complete: false, Description: 'Get Milk' },
      { Id: 2, Complete: true, Description: 'Recharge Batteries' },
      { Id: 3, Complete: false, Description: 'Download Bruce.js' },
      { Id: 4, Complete: false, Description: 'Depricate IE8' }
    ];
    for(var index = 0, count = data.length; index < count; index++){
      result.push(TodoFactory.create(data[index]));
    }
    return result;
  };
},['TodoFactory']);