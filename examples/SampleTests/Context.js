///<reference path="~/Scripts/QUnit/qunit.js" />
///<reference path="~/Scripts/jquery-1.7.2.js" />
///<reference path="~/Scripts/QUnit/sinon-1.2.0.js" />
///<reference path="~/Scripts/QUnit/sinon-ie-1.2.0.js" />
///<reference path="~/Scripts/QUnit/sinon-qunit-1.0.0.js" />
///<reference path="~/Scripts/Fortigent.Util.js"/>
///<reference path="~/Scripts/QUnit/RandomDataHelper.js" />
///<reference path="~/Scripts/knockout-2.1.0.js"/>
///<reference path="~/Scripts/underscore.js"/>
///<reference path="~/Scripts/brucejs/bruce.js"/>
///<reference path="~/Scripts/brucejs/bruce-tdd.js"/>
///<reference path="../../SampleAdder.js"/>
///javascriptlint
bruce.context("SampleAdder", function (context, given, when) {
  context.sut = new SampleAdder();

  given.the_value_of_a_is = function(value) {
    context.a = value;
  };

  given.the_value_of_b_is = function(value) {
    context.b = value;
  };

  when.adding_a_and_b = function() {
    context.result = context.sut.add(context.a, context.b);
  };
});