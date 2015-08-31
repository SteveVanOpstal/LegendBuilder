define(['angular'], function () {
   //override default error handling
   //source: http://odetocode.com/blogs/scott/archive/2014/04/21/better-error-handling-in-angularjs.aspx
   //TODO: can stacktrace provide clearer traces (http://engineering.talis.com/articles/client-side-error-logging/)
//   angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
//      return function (exception, cause) {
//         //trace error info in the browser
//         exception.message += ' (caused by "' + cause + '")';
//         console.error("Exception caught: " + exception.message);
//         console.error("   at file [" + exception.fileName + "] line [" + exception.lineNumber + "]");
//         console.error("   stack [" + exception.stack + "]");

//         //this indicates some error in the js files
//         //nothing a user can do about this
//         //so the server is informed
//         //however we should not use the angular http service for this, as this could create a circular problem
//         //instead basic jQuery is used
//         var postOk = false;
//         try {
//            var data = Object();
//            data.Error = 1;
//            data.Message = exception.message;
//            data.File = exception.fileName;
//            data.Line = exception.lineNumber;
//            data.Stack = exception.stack;
//            $.ajax({
//               type: "POST",
//               url: "/data/clientTracing/trace",
//               data: JSON.stringify(data),
//               dataType: "json",
//               timeout: 2500, // in milliseconds
//               success: function (data) {
//                  if (!IsDebug()) {
//                     console.error("   redirect to error page (error post OK)");
//                     window.location.href = "/Error.html"
//                  }
//               },
//               error: function (request, status, err) {
//                  if (!IsDebug()) {
//                     console.error("   redirect to error page (error post error)");
//                     window.location.href = "/Error.html"
//                  }
//               }
//            });
//            postOk = true;
//         } catch (err) {
//            console.error("Could not inform server:");
//            console.error(err);
//            postOk = false;
//         }

//         //redirect the user to some error page and apologize
//         //because normal processing stopped (e.g. page only partially visible)
////         if ((!postOk) && (!IsDebug())) {
////            console.error("   redirect to error page (post error info failed)");
////            window.location.href = "/Error.html"
////         }
//      };
//   });
})
