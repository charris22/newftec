(function() {
  var connectionString = "InstrumentationKey=e3c14da1-41b7-4524-9f7f-244855bd4220;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/;ApplicationId=daf8ad26-7f8c-47fa-94bb-0a374bf3fa1a";

  if (!connectionString || connectionString === "undefined") {
    console.warn('[AppInsights] Connection string is missing or undefined!');
    return;
  }

  var script = document.createElement('script');
  script.src = "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js";
  script.onload = function() {
    var appInsights = new Microsoft.ApplicationInsights.ApplicationInsights({
      config: {
        connectionString: connectionString
      }
    });
    appInsights.loadAppInsights();
    window.appInsights = appInsights;
    appInsights.trackPageView();
  };
  document.head.appendChild(script);
})();
