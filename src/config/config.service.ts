import convict from "convict";

import { appConfigSchema } from "./schema";

class ConfigService {
  private static instance: ConfigService;
  private config = convict(appConfigSchema);
  public environment = this.config.getProperties();

  private constructor() {
    this.config.validate({ allowed: "warn" });
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
}

export const appConfig = ConfigService.getInstance().environment;
