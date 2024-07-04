import { StackContext, Api, Config } from "sst/constructs";

export function API({ stack }: StackContext) {

  const AUTH_SECRET = new Config.Secret(stack, "AUTH_SECRET");

  const api = new Api(stack, "api", {
    routes: {
      $default: "packages/functions/src/lambda.handler",
    },
  });

  api.bind([AUTH_SECRET])

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
