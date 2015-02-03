///<reference path="~/Scripts/brucejs/bruce.js"/>
///<reference path="~/Scripts/vendor/jquery/1.11.1/jquery-1.11.1.js"/>
/// javascriptlint
(function(bruce, $) {
  bruce.register("Downloader", function(logger) {
    var self = this;
    self.download = function(action, data) {
      var $frame = $('<iframe style="display:none;"></iframe>'),
        $form = $('<form action="' + action + '" method="post" enctype="application/x-www-form-urlencoded"></form>'),
        $input;
      $frame.append($form);
      $('body').append($frame);
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          if (typeof data[property] === "string" || typeof data[property] === "number" || typeof data[property] === "boolean") {
            $input = $('<input type="hidden" id="' + property + '" name="' + property + '" value="' + data[property].toString() + '" />');
            $form.append($input);
          } else {
            logger.log("\"" + property + "\" is an invalid type (" + typeof data[property] + ") because it cannot be serialized into a form.");
          }
        }
      }
      $form.submit();
    };
  }, ["Logger"]);
})(window.bruce, jQuery);