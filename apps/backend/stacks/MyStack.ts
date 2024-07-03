import { StackContext, Api, RDS } from "sst/constructs";

export function API({ stack }: StackContext) {

  
  const database = new RDS(stack, "Database", {
    engine: "postgresql11.13",
    defaultDatabaseName: "ctc_cms",
    scaling: {
      minCapacity: "ACU_2",
      maxCapacity: "ACU_2",
    }    
  });


  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [database]
      }
    },
    routes: {
      $default: "packages/functions/src/hono.handler",
    },
    accessLog: {
      retention: "one_month",
    }
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
