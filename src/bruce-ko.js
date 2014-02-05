(function($, ko, bruce, undefined){
  $(function(){
    var bound = $('[data-model]');
    for(var index = 0, count = bound.length; index < count; index++){
      var $element = $(bound[index]);
      var modelName = $element.attr('data-model');
      var model = bruce.resolve(modelName);
      ko.applyBindings(model, bound[index]);
    }
    $('[data-cloak]').removeAttr('data-cloak');
  });
})(jQuery, ko, bruce);