import { StackContext, Api, Config, Bucket } from "sst/constructs";

export function API({ stack }: StackContext) {

  const AUTH_SECRET = new Config.Secret(stack, "AUTH_SECRET");
  const DB_URL = new Config.Secret(stack, "DB_URL");

  const api = new Api(stack, "api", {
    routes: {
      $default: "packages/functions/src/backend.handler",
    },
  });

  const ProfileBucket = new Bucket(stack, "ProfileBucket");
  const ResourceBucket = new Bucket(stack, "ResourceBucket", {
    blockPublicACLs: true,
    notifications: {
      createResourceOnUpload: {
        function: {
          handler: "packages/functions/src/functions.createResourceOnUpload",
          bind: [DB_URL],
          timeout: 10
        },
        events: ["object_created"]
      },
      removeResourceOnDelete: {
        function: {
          handler: "packages/functions/src/functions.removeResourceOnDelete",
          bind: [DB_URL],
          timeout: 10
        },
        events: ["object_removed"]
      },
    }
  });

  ResourceBucket.attachPermissionsToNotification("createResourceOnUpload", ["s3"])

  api.bind([AUTH_SECRET, DB_URL, ProfileBucket, ResourceBucket]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
