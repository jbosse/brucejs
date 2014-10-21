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
///javascriptlint
bruce.scenario("Adding 45 and 52", function (context, given, when) {
  given.the_value_of_a_is(45);
  given.the_value_of_b_is(52);
  when.adding_a_and_b();
});

bruce.then("the result should be 97", function (context, sut, result) {
  equal(result, 97);
});