define(['engWebModule'], function (app) {
   app.register.controller('userOverviewController', ['$scope', 'ajaxService', 'ajaxUrlService', function ($scope, ajaxService, ajaxUrlService) {
      $scope.loading = true;

      ajaxService.Post(ajaxUrlService.GetProductsByTeam(), { 'teamId': $scope.team.id })
      .success(function (response) {
         $scope.products = response;
         $scope.productIds = $.map(response, function (value, index) {
            return value.id;
         });
         $scope.GetData();
      });

      $scope.GetData = function (productId) {
         $scope.loading = true;

         if (productId) {
            var productIds = [productId];
         }
         else {
            var productIds = $scope.productIds;
         }

         ajaxService.Post(ajaxUrlService.GetUsersOverviewData(), { 'teamId': $scope.team.id, 'productIds': productIds })
         .success(function (response) {
            $(response).each(function () {
               this.complete = (this.tlog.total + this.project.total) <= 0;
            });

            $scope.users = response;

            $scope.loading = false;
         });
      }

      $scope.nameFormat = $scope.$parent.user.userDropDownFormat;
   } ]);
});