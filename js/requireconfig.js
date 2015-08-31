require.config({
   // alias libraries paths (relative to base-url)
   baseUrl: "js/controllers/routes",
   paths: {
      'module': 'js/config',

      'angular': 'extdev/angular/angular',
      'angular-route': 'extdev/angular/angular-route',
      'angular-chart': 'extdev/angularExtra/angularChart.js/angular-chart',
      'angular-chart-stackedBar': 'extdev/Chart.js/Chart.StackedBar',
      'angularAMD': 'extdev/angularExtra/angularAMD',
      'angularUI': 'extdev/angularExtra/ui-bootstrap-tpls-0.12.1',

      // to get angular-chart.js running we need to hint him the location of chart.js
      'chart': 'extdev/Chart.js/Chart',

      'ajax': 'js/Modules/ajax',
      'ajaxUrl': 'js/Modules/ajaxUrl',
      'alerts': 'js/Modules/alerts',
      'directives': 'js/Modules/directives',
      'exceptionOverride': 'js/Modules/exceptionOverride',
      'user': 'js/Modules/user',
      'filters': 'js/Modules/filters',

      // Controllers shared
      'backlogOverview': 'js/Controllers/Shared/BacklogOverview',
      'releaseOverview': 'js/Controllers/Shared/ReleaseOverview',
      'userOverview': 'js/Controllers/Shared/UserOverview'
   },
   // add angular modules that does not support AMD out of the box, put it in a shim
   shim: {
      'angularAMD': ['angular'],
      'angular-route': ['angular'],
      'route-styles': ['angular'],
      'angularUI': ['angular'],
      'angular-chart' : {'exports' : 'angular-chart', deps: ['angular', 'angularAMD', 'chart']},
      'angular-chart-stackedBar' : {'exports' : 'angular-chart-stackedBar', deps: ['angular-chart']}
   },
   // kick start application
   deps: ['module'],
   // enable error handling
   catchError: true
});

// error handling
require.onError = function (err) {
   //trace error info in the browser
   console.error("Require-js error of type [" + err.requireType + "]");
   console.error("   modules: " + err.requireModules);

   //this indicates some error in the js dependencies
   //nothing a user can do about this
   //so the server is informed
   //however we should not use the angular http service for this, as this could create a circular problem
   //instead basic jQuery is used
   var postOk = false;
   try {
      var data = Object();
      data.Error = 1;
      data.Message = "Require-js error of type [" + err.requireType + "]. Modules: [" + err.requireModules + "]";
      $.ajax({
         type: "POST",
         url: "/data/clientTracing/trace",
         data: JSON.stringify(data),
         dataType: "json",
         timeout: 2500, // in milliseconds
         success: function (data) {
            console.error("   redirect to error page (error post OK)");
            if (!IsDebug()) {
               window.location.href = "/Error.html"
            }
         },
         error: function (request, status, err) {
            console.error("   redirect to error page (error post error)");
            console.error(request);
            if (!IsDebug()) {
               window.location.href = "/Error.html"
            }
         }
      });
      postOk = true;
   } catch (err) {
      postOk = false;
      console.error("Could not inform server:");
      console.error(err);
   }

   //redirect to error page in release mode
   if ((!postOk) && (!IsDebug())) {
      console.error("   redirect to error page (post error info failed)");
      window.location.href = "/Error.html"
   }
   throw err;
}
