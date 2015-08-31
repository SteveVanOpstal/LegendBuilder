define(['angular'], function () {

   function User(userId, $q, ajaxService, ajaxUrlService, alertsService) {
      var userService = {};
      userService.id = userId;

      userService.isUser = true;
      if (userService.id > 20000) {
         userService.isUser = false;
      }

      userService.isUserGroup = !userService.isUser;

      var userPromise;
      userService.GetUserData = function () {
         if (!userPromise) {
            if (userService.isUser) {
               userPromise = ajaxService.Post(ajaxUrlService.GetUser(), { 'userId': userService.id })
               .success(function (response) {
                  for (var attrname in response) {
                     if (attrname !== 'id') {
                        userService[attrname] = response[attrname];
                     }
                  }
               });
            }
            else {
               userPromise = ajaxService.Post(ajaxUrlService.GetUser(), { 'userId': userService.id })
               .success(function (response) {
                  for (var attrname in response) {
                     if (attrname !== 'id') {
                        userService[attrname] = response[attrname];
                     }
                  }
               });
            }
         }
         return userPromise;
      }

      // always execute
      userService.GetUserData();

      userService.GetFormattedName = function (format) {
         if (userService.isUser) {
            userPromise = userService.GetUserData()
            .success(function (response) {
               if (typeof format === "undefined") {
                  format = userService.userDropDownFormat;
               }
               if (format == 0) {
                  userService.formattedName = userService.firstName + ' ' + userService.lastName;
               }
               else {
                  userService.name = userService.name.toUpperCase();
                  userService.formattedName = userService.name + ': ' + userService.firstName + ' ' + userService.lastName;
               }
            });
         }
         else {
            userPromise = ajaxService.Post(ajaxUrlService.GetUser(), { 'userId': userService.id })
            .success(function (response) {
               userService.formattedName = userService.name;
            });
         }
         return userPromise;
      }

      var groupsPromise;
      userService.GetGroups = function () {
         if (!groupsPromise) {
            groupsPromise = ajaxService.Post(ajaxUrlService.GetUserGroupsByUser(), { 'userId': userService.id })
            .success(function (response) {
               userService.groups = response;
            });
         }
         return groupsPromise;
      }

      var productsPromise;
      userService.GetProducts = function () {
         if (!productsPromise) {
            productsPromise = ajaxService.Post(ajaxUrlService.GetProductsAndUserSubscription(), { 'userId': userService.id })
            .success(function (response) {
               userService.products = response;
            });
         }
         return productsPromise;
      }

      userService.isMemberOf = function (usergroup) {
         return $q(function (resolve, reject) {
            userService.GetProducts().success(function () {
               var result = false;
               if (typeof userService.groups !== "undefined") {
                  for (var index = 0; index < userService.groups.length; ++index) {
                     if (userService.groups[index].name == usergroup) {
                        resolve();
                        return;
                     }
                  }
               }
               reject();
            }).error(function () {
               reject();
            });
         });
      }

      var teamsPromise;
      userService.GetTeams = function () {
         if (!teamsPromise) {
            teamsPromise = ajaxService.Post(ajaxUrlService.GetTeamsByUser(), { 'userId': userService.id })
            .success(function (response) {
               userService.teams = response;
            });
         }
         return teamsPromise;
      }

      userService.isTeamleader = function () {
         return userService.isTeamleaderOf();
      }

      userService.isTeamleaderOf = function (team) {
         return $q(function (resolve, reject) {
            userService.GetTeams().success(function () {
               var result = false;
               if (typeof userService.teams !== "undefined") {
                  if (userService.teams.length > 0 && (team === "undefined" || team === false || team === '')) {
                     resolve();
                     return;
                  }
                  for (var index = 0; index < userService.teams.length; ++index) {
                     if (userService.teams[index].name == team) {
                        resolve();
                        return;
                     }
                  }
               }
               reject();
            }).error(function () {
               reject();
            });
         });
      }

      return userService;
   }

   angular.module('user', [])
   .factory('userService', ['$q', 'ajaxService', 'ajaxUrlService', 'alertsService', function ($q, ajaxService, ajaxUrlService, alertsService) {
      return function (userId) {
         return new User(userId, $q, ajaxService, ajaxUrlService, alertsService);
      }
   } ]);
})
