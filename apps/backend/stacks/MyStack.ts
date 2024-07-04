import { StackContext, Api } from "sst/constructs";

export function API({ stack }: StackContext) {

  const api = new Api(stack, "api", {
    routes: {
      $default: "packages/functions/src/lambda.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
