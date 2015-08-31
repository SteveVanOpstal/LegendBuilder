define(['angular'], function () {
   angular.module('ajaxUrl', [])
   .service('ajaxUrlService', [function () {

      this.GetProducts = function () {
         return "Products/GetProducts";
      }
      this.GetProductsByUser = function () {
         return "Products/GetProductsByUser";
      }
      this.GetProductsByTeam = function () {
         return "Products/GetProductsByTeam";
      }
      this.GetProductsAndUserSubscription = function () {
         return "Products/GetProductsAndUserSubscription";
      }
      this.GetSystemTypes = function () {
         return "SystemTypes/GetSystemTypes";
      }
      this.GetOverviewData = function () {
         return "Overview/GetOverviewData";
      }
      this.GetUsersOverviewData = function () {
         return "Overview/GetUsersOverviewData";
      }
      this.GetTlogVersionStatusByMonth = function () {
         return "Overview/GetTlogVersionStatusByMonth";
      }
      this.GetPsRefVersionStatusByMonth = function () {
         return "Overview/GetPsRefVersionStatusByMonth";
      }
      this.GetTlogVersionBacklogByMonth = function () {
         return "Overview/GetTlogVersionBacklogByMonth";
      }
      this.GetPsRefVersionBacklogByMonth = function () {
         return "Overview/GetPsRefVersionBacklogByMonth";
      }
      this.GetTlogVersionStatusCountByMonth = function () {
         return "Overview/GetTlogVersionStatusCountByMonth";
      }
      this.GetPsrefVersionStatusCountByMonth = function () {
         return "Overview/GetPsrefVersionStatusCountByMonth";
      }
      this.GetUpcommingSwVersions = function () {
         return "SwVersions/GetUpcommingSwVersions";
      }
      this.GetUsers = function () {
         return "User/GetUsers";
      }
      this.GetUsersByProduct = function () {
         return "User/GetUsersByProduct";
      }
      this.GetUser = function () {
         return "User/GetUser";
      }
      this.GetUserGroups = function () {
         return "UserGroups/GetUserGroups";
      }
      this.GetUserGroup = function () {
         return "UserGroups/GetUserGroup";
      }
      this.GetUserGroupsByUser = function () {
         return "UserGroups/GetUserGroupsByUser";
      }
      this.GetTeams = function () {
         return "Teams/GetTeams";
      }
      this.GetTeamsByUser = function () {
         return "Teams/GetTeamsByUser";
      }
   } ]);
})
