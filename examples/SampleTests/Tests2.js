///javascriptlint
bruce.scenario("Adding 24 and 12", function (context, given, when) {
  given.the_value_of_a_is(24);
  given.the_value_of_b_is(12);
  when.adding_a_and_b();
});

bruce.then("the result should be 36", function(context, sut, result) {
  equal(result, 36);
});