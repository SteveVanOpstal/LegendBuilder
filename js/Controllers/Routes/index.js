
define(['engWebModule', 'backlogOverview', 'releaseOverview', 'userOverview'], function (app) {

   app.register.controller('indexController', ['$scope', 'ajaxService', 'ajaxUrlService', 'userService', function ($scope, ajaxService, ajaxUrlService, userService) {
      $scope.user = userService($('#userId').val());
   } ]);

   app.register.controller('teamController', ['$scope', 'ajaxService', 'ajaxUrlService', 'userService', function ($scope, ajaxService, ajaxUrlService, userService) {
      $scope.permitted = $scope.$parent.user.isTeamleader();

      ajaxService.Post(ajaxUrlService.GetTeamsByUser(), { 'userId': $scope.$parent.user.id })
      .success(function (response) {
         $scope.teams = response;
      });
   } ]);

   app.register.controller('tlogChartController', ['$scope', 'ajaxService', 'ajaxUrlService', 'userService', function ($scope, ajaxService, ajaxUrlService, userService) {
      $scope.GetData = function (productId) {
         $scope.chartStatus = { loading: true };

         var statuses = [58, 52, 4, 61, 88, 48, 49, 81];

         ajaxService.Post(ajaxUrlService.GetTlogVersionStatusByMonth(), { 'statuses': statuses, 'productId': productId })
         .success(function (response) {
            $scope.chartStatus = { loading: false, labels: [], data: [] };
            $scope.chartStatus.colours = ['#F7464A', '#FDB45C', '#FDB45C', '#46BD9E', '#46BD9E', '#6692E0', '#6692E0', '#6692E0'];
            $scope.chartStatus.series = ['Opened', 'Coded-Review', 'Closed', 'Finished', 'Active', 'Killed', 'Not-Reproducible', 'Badly-Solved'];

            $(response).each(function (index) {
               var amounts = [];
               $(this).each(function (objIndex, obj) {
                  $scope.chartStatus.labels[objIndex] = obj.month;
                  amounts.push(obj.count);
               });
               $scope.chartStatus.data[index] = amounts;
            });
         })
         .error(function (response) {
            $scope.chartStatus.loading = false;
         });

         $scope.chartBacklog = { loading: true };

         ajaxService.Post(ajaxUrlService.GetTlogVersionBacklogByMonth(), { 'productId': productId })
         .success(function (response) {
            $scope.chartBacklog = { loading: false, labels: [], data: [] };
            $scope.chartBacklog.colours = ['#6692E0'];
            $scope.chartBacklog.data[0] = [];

            $(response).each(function (index) {
               $scope.chartBacklog.labels[index] = this.month;
               $scope.chartBacklog.data[0][index] = this.count;
            });
         })
         .error(function (response) {
            $scope.chartBacklog.loading = false;
         });
      }

      $scope.$on('create', function (event, chart) {
         chart.resize();
      });

      $scope.collapsed = true;

      $scope.radioModelType = 'Bar';
      $scope.type = 'Bar';

      $scope.$parent.user.isMemberOf('TLOG Board').then(function () {
         $scope.permitted = true;
      });
   } ]);

   app.register.controller('psRefChartController', ['$scope', 'ajaxService', 'ajaxUrlService', 'userService', function ($scope, ajaxService, ajaxUrlService, userService) {
      $scope.GetData = function (productId) {
         $scope.chartStatus = { loading: true };

         var statuses = [null, 39, 32, 25, 42];

         ajaxService.Post(ajaxUrlService.GetPsRefVersionStatusByMonth(), { 'statuses': statuses, 'productId': productId })
         .success(function (response) {
            $scope.chartStatus = { loading: false, labels: [], data: [] };
            $scope.chartStatus.colours = ['#949FB1', '#46BD9E', '#FDB45C', '#F7464A', '#6692E0'];
            $scope.chartStatus.series = ['Entered', 'Ended', 'Coding', 'New', 'Killed'];

            $(response).each(function (index) {
               var amounts = [];
               $(this).each(function (objIndex, obj) {
                  $scope.chartStatus.labels[objIndex] = obj.month;
                  amounts.push(obj.count);
               });
               $scope.chartStatus.data[index] = amounts;
            });
         })
         .error(function (response) {
            $scope.chartStatus.loading = false;
         });

         $scope.chartBacklog = { loading: true };

         ajaxService.Post(ajaxUrlService.GetPsRefVersionBacklogByMonth(), { 'productId': productId })
         .success(function (response) {
            $scope.chartBacklog = { loading: false, labels: [], data: [] };
            $scope.chartBacklog.colours = ['#6692E0'];
            $scope.chartBacklog.data[0] = [];

            $(response).each(function (index) {
               $scope.chartBacklog.labels[index] = this.month;
               $scope.chartBacklog.data[0][index] = this.count;
            });
         })
         .error(function (response) {
            $scope.chartBacklog.loading = false;
         });
      }

      $scope.collapsed = true;

      $scope.radioModelType = 'Bar';
      $scope.type = 'Bar';

      $scope.$parent.user.isMemberOf('TLOG Board').then(function () {
         $scope.permitted = true;
      });
   } ]);

});