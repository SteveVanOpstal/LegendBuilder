"use strict";

define(['angularAMD', 'angular-chart', 'angular-chart-stackedBar', 'angularUI', 'angular-route', 'route-styles', 'ajax', 'ajaxUrl', 'alerts', 'directives', 'filters', 'exceptionOverride', 'user'], function (angularAMD) {
   var app = angular.module("applicationModule", ['chart.js', 'ui.bootstrap', 'ngRoute', 'routeStyles', 'ajax', 'ajaxUrl', 'alerts', 'directives', 'filters'/*, 'exceptionOverride'*/, 'user']);

   //disable debug info for better performance
   app.config(['$compileProvider', function ($compileProvider) {
      if (!IsDebug()) {
         $compileProvider.debugInfoEnabled(false);
      }
   } ]);

   app.config(function ($httpProvider) {
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
      $httpProvider.defaults.withCredentials = true;
   });


   app.config(['$routeProvider', function ($routeProvider) {
      var page = window.location.pathname.split("/").pop();
      var controller = page.substr(0, page.indexOf('.php'));

      $routeProvider
      .when("/", angularAMD.route({
         templateUrl: function (rp) { return '/include/tokdev/html/controllers/routes/' + controller + '.html' },
         controllerUrl: "/include/tokdev/js/controllers/routes/" + controller + ".js"
      }))
      .otherwise({ redirectTo: '/' })
   } ]);

   app.config(['ChartJsProvider', function (ChartJsProvider) {
      ChartJsProvider.setOptions({
         legendTemplate: "\
         <ul class=\"chart-legend <%=name.toLowerCase()%>-legend\">\
            <% for (var i=0; i<datasets.length; i++){%>\
               <li>\
                  <span style=\"background-color:<%=datasets[i].strokeColor%>\"></span>\
                  <%if(datasets[i].label){%><%=datasets[i].label%><%}%>\
               </li>\
            <%}%>\
         </ul>",
         tooltipTemplate: "<td class=\"label\"><%if (label){%><%=label%>: <%}%><%=value%></td>",
         multiTooltipTemplate: "<td><div style=\"background-color: <%=strokeColor%>\" class=\"label\"><%=datasetLabel%></div></td><td class=\"label\" style=\"padding-right:0\">: <%=value%></td>",
         customTooltips: function (tooltip) {
            if ($('.chartjs-tooltip').length <= 0) {
               $('.chart-container').prepend("<table class='chartjs-tooltip' style='opacity: 0'><tbody></tbody></table>");

               $('canvas.chart').on('mousemove', function (evt) {
                  var chartContainer = $(this).parent();
                  var tooltipEl = chartContainer.find('table.chartjs-tooltip');

                  var rect = this.getBoundingClientRect();
                  var x = evt.clientX - rect.left - chartContainer.position().left + tooltipEl.width() + 20;
                  var y = evt.clientY - rect.top + (tooltipEl.height() / 2);

                  var tooltipTop = chartContainer.position().top;
                  if (y < tooltipTop) {
                     y = tooltipTop;
                  }

                  var tooltipBottom = chartContainer.position().top + chartContainer.height() - tooltipEl.height();
                  if (y > tooltipBottom) {
                     y = tooltipBottom;
                  }

                  var tooltipRight = chartContainer.position().left + chartContainer.width() - tooltipEl.width();
                  if (x > tooltipRight) {
                     x = evt.clientX - rect.left - chartContainer.position().left - 20;
                  }

                  $(this).parent().find('table.chartjs-tooltip').css({
                     left: x + 'px',
                     top: y + 'px'
                  });
               });
            }

            // tooltip can be an invalid
            if (!tooltip) {
               $('table.chartjs-tooltip').css({ opacity: 0 });
               return;
            }

            var innerHtml = '';
            if (tooltip.labels) {
               for (var i = 0; i < tooltip.labels.length; i++) {
                  innerHtml += '  <tr class="labels chartjs-tooltip-value">' + tooltip.labels[i] + '</tr>';
               }
            }
            else {
               innerHtml += '  <tr class="labels chartjs-tooltip-value">' + tooltip.text + '</tr>';
            }

            var tooltipEl = $(tooltip.chart.canvas).parent().find('table.chartjs-tooltip');
            tooltipEl.html(innerHtml);
            tooltipEl.css({
               opacity: 1,
               fontFamily: tooltip.fontFamily,
               fontSize: tooltip.fontSize,
               fontStyle: tooltip.fontStyle
            });
         }
      });
   } ])

   // Start Angular when DOM is ready
   angularAMD.bootstrap(app);

   //app OK
   return app;
});