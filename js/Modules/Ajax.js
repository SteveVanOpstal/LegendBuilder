define(['angular'], function () {
   angular.module('ajax', [])
   .service('ajaxService', ['$http', 'alertsService', function ($http, alertsService) {

      this.Post = function (url, data) {
         return $http.post(
            'Server/Server.php',
            { 'url': url, 'data': data }
         )
         .error(function (response) {
            alertsService.RenderErrorMessage(response);
         })
      }

   } ]);
})
