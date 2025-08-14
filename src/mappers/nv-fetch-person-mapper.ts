import type {
  TNvOpenPersonPageParams,
  TNvOpenPersonPageResult,
} from "../types/actions/connection";
import { ThenWorkflowMapper } from "./then-workflow-mapper.abstract";

export class NvFetchPersonMapper extends ThenWorkflowMapper<
  TNvOpenPersonPageParams,
  TNvOpenPersonPageResult
> {
  constructor() {
    super({
      actionConfigs: [],
      responseMappings: [],
      baseActionType: "nv.openPersonPage",
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
