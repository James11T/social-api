import { Router } from "express";
import {
  getSettingsController,
  getSpecificSettingController,
  setSettingController,
} from "../controllers/settings.controller";

const settingsRouter = Router();

settingsRouter.get("/", getSettingsController);

settingsRouter.get("/:settingName", getSpecificSettingController);
settingsRouter.patch("/:settingName", setSettingController);

export default settingsRouter;
