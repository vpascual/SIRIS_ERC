'use strict';

describe('Controller: KeywordsCtrl', function () {

  // load the controller's module
  beforeEach(module('ercApp'));

  var KeywordsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KeywordsCtrl = $controller('KeywordsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
