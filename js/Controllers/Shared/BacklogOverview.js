define(['engWebModule'], function (app) {

   function GetAssignedTlogCountsResult(scope, response, createLinkCallback) {
      scope.tasks[0].records[0].count = response.unassignedCount;
      scope.tasks[0].records[0].link = createLinkCallback('') + '&AssignedTo=NULL';

      scope.tasks[1].records[0].count = response.codeAssignedCount;
      scope.tasks[1].records[0].link = createLinkCallback(58);

      scope.tasks[2].records[0].count = response.reviewAssignedCount;
      scope.tasks[2].records[0].link = createLinkCallback(52);

      scope.tasks[4].records[0].count = response.testAssignedCount;
      scope.tasks[4].records[0].link = createLinkCallback(4);
   }

   function GetAssignedProjectCountsResult(scope, response, createLinkCallback) {
      scope.tasks[0].records[1].count = response.unassignedCount;
      scope.tasks[0].records[1].link = createLinkCallback('') + '&AssignedTo=NULL';

      scope.tasks[1].records[1].count = response.codeAssignedCount;
      scope.tasks[1].records[1].link = createLinkCallback(32);

      scope.tasks[2].records[1].count = response.reviewAssignedCount;
      scope.tasks[2].records[1].link = createLinkCallback(89);

      scope.tasks[3].records[1].count = response.testIntAssignedCount;
      scope.tasks[3].records[1].link = createLinkCallback(34);

      scope.tasks[4].records[1].count = response.testAssignedCount;
      scope.tasks[4].records[1].link = createLinkCallback(86);
   }

   function GetAssignedTlogCountsByUserResult(scope, response, createLinkCallback) {
      scope.tasks[1].records[2].count = response.codeAssignedCount;
      scope.tasks[1].records[2].link = createLinkCallback(58) + '&AssignedTo=' + scope.user.id;

      scope.tasks[2].records[2].count = response.reviewAssignedCount;
      scope.tasks[2].records[2].versions = response.reviewAssignedVersionCount;
      scope.tasks[2].records[2].link = createLinkCallback(52) + '&AssignedToCodeReview=' + scope.user.id;

      scope.tasks[4].records[2].count = response.testAssignedCount;
      scope.tasks[4].records[2].link = createLinkCallback(4) + '&AssignedToTest=' + scope.user.id;
   }

   function GetAssignedProjectCountsByUserResult(scope, response, createLinkCallback) {
      scope.tasks[1].records[3].count = response.codeAssignedCount;
      scope.tasks[1].records[3].link = createLinkCallback(32) + '&AssignedTo=' + scope.user.id;

      scope.tasks[2].records[3].count = response.reviewAssignedCount;
      scope.tasks[2].records[3].link = createLinkCallback(89) + '&ReviewAssignedTo=' + scope.user.id;

      scope.tasks[3].records[3].count = response.testIntAssignedCount;
      scope.tasks[3].records[3].link = createLinkCallback(34) + '&AssignedTo=' + scope.user.id;

      scope.tasks[4].records[3].count = response.testAssignedCount;
      scope.tasks[4].records[3].link = createLinkCallback(86) + '&TestAssignedTo=' + scope.user.id;
   }

   function GetTotalCount(counts) {
      return GetNumber(counts.codeAssignedCount) + GetNumber(counts.reviewAssignedCount) + GetNumber(counts.testIntAssignedCount) + GetNumber(counts.testAssignedCount);
   }

   app.register.controller('backlogOverviewProductController', ['$scope', 'ajaxService', 'ajaxUrlService', function ($scope, ajaxService, ajaxUrlService) {
      $scope.overview.loading = true;

      $scope.titles = ['TLOG', 'PSREF', 'TLOG(' + $scope.user.name + ')', 'PSREF(' + $scope.user.name + ')'];

      $scope.tasks =
            [
               {
                  stateReadable: 'assigned',
                  records: [{}, {}, { disabled: true }, { disabled: true}]
               },
               {
                  stateReadable: 'fixed',
                  records: [{}, {}, {}, {}]
               },
               {
                  stateReadable: 'reviewed',
                  records: [{}, {}, {}, {}]
               },
               {
                  stateReadable: 'tested (integration)',
                  records: [{ disabled: true }, {}, { disabled: true }, {}]
               },
               {
                  stateReadable: 'tested (final)',
                  records: [{}, {}, {}, {}]
               }
            ];

      function CreateTlogSearchUrl(statusId) {
         return '/FuelPos/Search.php?StatusId=' + statusId + '&DetectedInProduct=' + $scope.overview.id;
      }

      function CreateProjectSearchUrl(statusId) {
         return '/Projects/Search.php?Status=' + statusId + '&Platform[]=' + $scope.overview.id;
      }

      ajaxService.Post(ajaxUrlService.GetOverviewData(), { 'productIds': [$scope.overview.id], 'userId': $scope.user.id })
      .success(function (response) {
         GetAssignedTlogCountsResult($scope, response.tlogCounts, CreateTlogSearchUrl);
         GetAssignedProjectCountsResult($scope, response.projectCounts, CreateProjectSearchUrl);
         GetAssignedTlogCountsByUserResult($scope, response.tlogUserCounts, CreateTlogSearchUrl);
         GetAssignedProjectCountsByUserResult($scope, response.projectUserCounts, CreateProjectSearchUrl);

         var totalAssigned = GetTotalCount(response.tlogUserCounts) + GetTotalCount(response.projectUserCounts);
         $scope.overview.completed = totalAssigned <= 0;

         $scope.overview.loading = false;
      })
      .error(function (response) {
         $($scope.tasks).each(function () {
            $(this.records).each(function () {
               this.warning = response;
            });
         });

         $scope.overview.loading = false;
      });
   } ]);


   app.register.controller('backlogOverviewSwVersionController', ['$scope', 'ajaxService', 'ajaxUrlService', function ($scope, ajaxService, ajaxUrlService) {
      $scope.overview.loading = true;

      $scope.titles = ['TLOG', 'PSREF', 'TLOG(' + $scope.user.name + ')', 'PSREF(' + $scope.user.name + ')'];

      $scope.tasks =
            [
               {
                  stateReadable: 'assigned',
                  records: [{}, {}, { disabled: true }, { disabled: true }],
                  show: false
               },
               {
                  stateReadable: 'fixed',
                  records: [{}, {}, {}, {}]
               },
               {
                  stateReadable: 'reviewed',
                  records: [{}, {}, {}, {}]
               },
               {
                  stateReadable: 'tested (integration)',
                  records: [{ disabled: true }, {}, { disabled: true }, {}]
               },
               {
                  stateReadable: 'tested (final)',
                  records: [{}, {}, {}, {}]
               }
            ];

      $scope.tooltips = true;

      function CreateTlogSearchUrl(statusId) {
         return '/FuelPos/Search.php?StatusId=' + statusId + '&FixedInVersion=' + $scope.overview.id;
      }

      function CreateProjectSearchUrl(statusId) {
         return '/Projects/Search.php?Status=' + statusId + '&VersionsSWVersion=' + $scope.overview.id;
      }

      ajaxService.Post(ajaxUrlService.GetOverviewData(), { 'swVersionId': $scope.overview.id, 'userId': $scope.user.id })
      .success(function (response) {
         GetAssignedTlogCountsResult($scope, response.tlogCounts, CreateTlogSearchUrl);
         GetAssignedProjectCountsResult($scope, response.projectCounts, CreateProjectSearchUrl);
         GetAssignedTlogCountsByUserResult($scope, response.tlogUserCounts, CreateTlogSearchUrl);
         GetAssignedProjectCountsByUserResult($scope, response.projectUserCounts, CreateProjectSearchUrl);

         $scope.overview.totalTlogs = GetTotalCount(response.tlogCounts);
         $scope.overview.totalProjects = GetTotalCount(response.projectCounts);

         var totalAssigned = GetTotalCount(response.tlogUserCounts) + GetTotalCount(response.projectUserCounts);
         $scope.overview.completed = totalAssigned <= 0;

         $scope.overview.loading = false;
      })
      .error(function (response) {
         $($scope.tasks).each(function () {
            $(this.records).each(function () {
               this.warning = response;
            });
         });

         $scope.overview.loading = false;
      });
   } ]);
});