describe('A suite', function() {

    beforeEach(module('myApp'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    it('contains spec with an expectation', function() {
        var $scope = {};
        var controller = $controller('AppController', { $scope: $scope });
        expect(FILL_ME_IN).toEqual('AngularJS Rocks!');
    });
});