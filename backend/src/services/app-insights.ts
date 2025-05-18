import appInsights from "applicationinsights";

const connStr = process.env.APPINSIGHTS_CONNECTION_STRING;
if (connStr) {
  appInsights
    .setup(connStr)
    .setAutoCollectRequests(true) // captura requisições HTTP
    .setAutoCollectDependencies(true) // captura calls externas
    .setAutoCollectConsole(true) // captura console.log
    .setAutoCollectExceptions(true) // captura erros não tratados
    .setUseDiskRetryCaching(true) // cache em disco se falhar
    .start();
  console.log("Application Insights iniciado.");
}
export const telemetryClient = appInsights.defaultClient;
