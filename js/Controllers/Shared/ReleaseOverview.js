
define(['engWebModule', 'backlogOverview'], function (app) {
   app.register.controller('releaseOverviewController', ['$scope', '$timeout', 'ajaxService', 'ajaxUrlService', function ($scope, $timeout, ajaxService, ajaxUrlService) {

      $scope.GetData = function () {
         ajaxService.Post(ajaxUrlService.GetUpcommingSwVersions(), { 'productId': $scope.productId })
         .success(function (response) {
            $scope.swVersions = response;
         });
      }

      $scope.GetWorkingDays = function (date) {
         var result = 0;
         var startDate = new Date();
         var endDate = new Date(date);
         while (startDate <= endDate) {
            var weekDay = startDate.getDay();
            if (weekDay != 0 && weekDay != 6)
               result++;

            startDate.setDate(startDate.getDate() + 1);
         }

         return result;
      }

      $scope.productFilter = function (overview) {
         return this.$parent.selectedProduct ? GetNumber(this.$parent.selectedProduct.id) == overview.productId : true;
      }

      $scope.productOptionFilter = function (product) {
         var available = false;
         $($scope.swVersions).each(function () {
            if (this.productId == GetNumber(product.id)) {
               available = true;
            }
         });
         return available;
      }

   } ]);
});