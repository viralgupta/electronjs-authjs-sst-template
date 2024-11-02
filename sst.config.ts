import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "electronjs-authjs-sst-template",
      region: "ap-south-1",
    };
  },
  stacks(app) {
    app.stack(API);
    if (app.stage === "dev"){
      app.setDefaultRemovalPolicy("destroy");
    }
  }
} satisfies SSTConfig;
