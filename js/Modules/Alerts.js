define(['angular'], function () {
   angular.module('alerts', [])
   .service('alertsService', [function () {
      var alerts = [];

      this.ClearAlerts = function () {
         alerts.length = 0;
      }

      this.RenderErrorMessage = function (message) {
         var messageBox = FormatMessage(message);
         console.log("Error: [" + messageBox + "]");
         alerts.push({ 'type': 'danger', 'msg': messageBox });
      };

      this.RenderWarningMessage = function (message) {
         var messageBox = FormatMessage(message);
         console.log("Warning: [" + messageBox + "]");
         alerts.push({ 'type': 'warning', 'msg': messageBox });
      };

      this.RenderSuccessMessage = function (message) {
         var messageBox = FormatMessage(message);
         console.log("Success: [" + messageBox + "]");
         alerts.push({ 'type': 'success', 'msg': messageBox });
      };

      this.RenderInformationalMessage = function (message) {
         var messageBox = FormatMessage(message);
         console.log("Info: [" + messageBox + "]");
         alerts.push({ 'type': 'info', 'msg': messageBox });
      };

      this.ComposeAlert = function (message, type) {
         var messageBox = FormatMessage(message);
         var alert = { 'type': type, 'msg': messageBox };
         return alert;
      }

      this.CloseAlert = function (index) {
         alerts.splice(index, 1);
      };

      function FormatMessage(message) {
         if ((null == message) || (message === undefined) || (message.length === 0)) {
            return "Unknown client error. Please contact a engineering website administrator";
         }
         var messageBox = "";
         if (angular.isArray(message) == true) {
            for (var i = 0; i < message.length; i++) {
               messageBox = messageBox + message[i];
            }
         } else {
            messageBox = message;
         }
         return messageBox;
      }

      this.GetAlerts = function () {
         return alerts;
      }
   } ])
   .controller('alertsController', ['$scope', 'alertsService', function ($scope, alertsService) {
      $scope.alerts = alertsService.GetAlerts();

      $scope.CloseAlert = function (index) {
         alertsService.CloseAlert(index);
      };
   } ]);
})
