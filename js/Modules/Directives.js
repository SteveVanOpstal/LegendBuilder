define(['angular'], function () {
   angular.module('directives', [])
   .directive('tokngImg', [function () {
      return {
         restrict: "E",
         scope: {
            src: "@",
            alt: "@",
            width: "@",
            height: "@"
         },
         template: "<img ng-src='{{src}}' alt='{{alt}}' width='{{width}}' height='{{height}}'/>",
         replace: false,
         transclude: false
      };
   } ])
   .directive('tokngLoading', [function () {
      return {
         restrict: "E",
         template: "<img ng-src='/Images/ajax-loader.gif' alt='loading...'/>",
         replace: false,
         transclude: false
      };
   } ])
   .directive('tokngLoadingWrap', [function () {
      return {
         priority: 1000,
         restrict: "E",
         scope: {
            loading: "="
         },
         template: "\
            <div class='tokng-loading-wrap-overlay loading' style=\"z-index:25;position:absolute;background-color:rgba( 256, 256, 256, .6 );background-image:url('/Images/ajax-loader.gif');background-repeat:no-repeat;background-position:50% 50%;height:16px;width:16px\"></div>\
            <div>\
               <div ng-transclude></div>\
               <div style='clear:both'></div>\
            </div>",
         link: function (scope, element, attrs) {
            var overlay = element.children('.tokng-loading-wrap-overlay');
            var transclude = element.children().children('div[ng-transclude]').parent();

            scope.$watch('loading', function (value) {
               if (value) {
                  overlay
                     .css('visibility', 'visible')
                     .addClass('loading');
               }
               else {
                  overlay
                     .css('visibility', 'hidden')
                     .removeClass('loading');
               }
               resizeOverlay();
            });

            function resizeOverlay() {
               var width = transclude.outerWidth();
               var height = transclude.outerHeight();
               if (width <= 1 || height <= 1) {
                  overlay
                     .css('position', 'relative')
                     .css('width', 16)
                     .css('height', 16);

               }
               else if (width < 16 || height < 16) {
                  overlay
                     .css('position', 'absolute')
                     .css('width', 16)
                     .css('height', 16);
               }
               else {
                  overlay
                     .css('position', 'absolute')
                     .css('width', width)
                     .css('height', height);
               }
            }

            transclude[0].addEventListener("DOMSubtreeModified", resizeOverlay);
            $(window).on('resize', resizeOverlay);
         },
         replace: false,
         transclude: true
      };
   } ])
   .directive('tokngTooltip', [function () {
      return {
         restrict: "E",
         scope: {
            "tip": "@",
            "placement": "@"
         },
         template: "<img alt='Tooltip' src='/Images/icons/help.png' popover='{{::tip}}' popover-trigger='mouseenter' popover-placement='{{::placement}}' /></span>",
         replace: false,
         transclude: false
      };
   } ])
   .directive('tokngCollapsiblePanel', [function () {
      return {
         restrict: "E",
         scope: {
            panelTitle: "@",
            isCollapsed: "=collapsed",
            onOpen: "&"
         },
         template: "\
            <div class='panel panel-default'>\
               <div class='panel-heading panel-heading-collapsible'>\
                  <h3 class='panel-title'><a ng-class='{collapsed: isCollapsed}' ng-click='isCollapsed=!isCollapsed'>{{panelTitle}}</a></h3>\
               </div>\
               <div class='panel-body' collapse='isCollapsed' ng-transclude>\
               </div>\
            </div>",
         link: function (scope, element, attrs) {
            scope.$watch('isCollapsed', function (value) {
               if (typeof (scope.onOpen) === "function" && value === false) {
                  scope.onOpen();
               }
            });
         },
         replace: false,
         transclude: true
      };
   } ])
   //This directive can be used as an attribute in combination with the ng-repeat
   //directive. It will call the function set in the attribute when the last
   //element in the repeat is rendered in the view.
   .directive('tokngPostRepeat', ['$parse', function ($parse) {
      return {
         restrict: 'A',
         link: function (scope, element, attrs) {
            if (scope.$last) {
               //parse value of 'tokngPostRepeat' attribute
               var loadHandler = $parse(attrs.tokngPostRepeat);
               //run the function returned by $parse.
               //it needs the scope object to operate properly.
               loadHandler(scope);
            }
         }
      };
   } ])
   .directive('tokngUserHyperlink', ['userService', function (userService) {
      return {
         restrict: 'E',
         scope: {
            userId: "=",
            format: "="
         },
         template: "\
            <a href=\"../Users/{{user ? 'ViewProfile.php' : 'ViewGroup.php'}}?{{(user ? 'UserId=' : 'UserGroupId=') + userId}}\">{{formattedName | nbspWhenEmpty}}</a>\
         ",
         link: function (scope, element, attrs) {
            scope.user = true;
            if (scope.userId > 20000) {
               scope.user = false;
            }

            var userInstance = userService(scope.userId);

            userInstance.GetFormattedName(scope.format)
            .success(function (response) {
               scope.formattedName = userInstance.formattedName;
            });
         },
         replace: true
      };
   } ])
   .directive('tokngUserHyperlinkPopup', ['userService', function (userService) {
      return {
         restrict: 'E',
         scope: {
            userId: "=",
            format: "="
         },
         template: "\
            <a href='' ng-click='::click()'>{{formattedName | nbspWhenEmpty}}</a>\
         ",
         link: function (scope, element, attrs) {
            scope.user = true;
            if (scope.userId > 20000) {
               scope.user = false;
            }

            scope.click = function () {
               window.open((scope.user ? "../Users/ViewProfile.php?LoadMenu=false&UserId=" : "../Users/ViewGroup.php?LoadMenu=false&UserGroupId=") + scope.userId, 'blank', 'height=350, width=900, resizable=1');
            }

            var userInstance = userService(scope.userId);

            userInstance.GetFormattedName(scope.format)
            .success(function (response) {
               scope.formattedName = userInstance.formattedName;
            });
         },
         replace: true
      };
   } ])
   .directive('tokngBacklog', [function () {
      return {
         restrict: "E",
         scope: {
            "count": "=",
            "link": "=",
            "warning": "=",
            "disabled": "="
         },
         template: "\
            <span>\
               <a ng-show='count>0' href='{{link}}'>{{count}}</a>\
               <span ng-show='count == 0' class='glyphicon glyphicon-ok' tooltip='{{warning}}'></span>\
               <span ng-show='warning && disabled' class='glyphicon glyphicon-warning-sign' tooltip='{{warning}}'></span>\
            </span>",
         replace: true,
         transclude: false
      };
   } ]);
})
