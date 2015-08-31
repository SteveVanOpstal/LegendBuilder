define(['angular'], function () {
   angular.module('filters', [])
   .filter('capitalize', function () {
      return function (input) {
         if (input != null) {
            input = input.toLowerCase();
         }
         return input.substring(0, 1).toUpperCase() + input.substring(1);
      }
   })
   .filter('nbspWhenEmpty', function () {
      return function (input) {
         if (!input || input.length <= 0) {
            return "\u00A0";
         }
         return input;
      }
   });
});