import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inspectionRequestsRouter from "./inspectionRequests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inspectionRequestsRouter);

export default router;
