bruce.register('TodoViewModel',function(TodoService, TodoFactory){
  var self = this;
  self.title = ko.observable('Todos');
  self.todos = ko.observableArray(TodoService.query());
  self.addTodo = function(){
    self.todos.push(TodoFactory.create({Id:0, Complete: false, Description: ''}));
  };
},['TodoService', 'TodoFactory']);