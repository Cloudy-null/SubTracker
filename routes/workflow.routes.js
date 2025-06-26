import { Router } from "express";

import {SendReminders} from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post("/", SendReminders)

export default workflowRouter;