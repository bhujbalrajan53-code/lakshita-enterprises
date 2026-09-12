import { Router, type IRouter } from "express";
import { CreateInspectionRequestBody, CreateInspectionRequestResponse } from "@workspace/api-zod";
import { db, inspectionRequestsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/inspection-requests", async (req, res): Promise<void> => {
  const parsed = CreateInspectionRequestBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid inspection request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [created] = await db
    .insert(inspectionRequestsTable)
    .values(parsed.data)
    .returning();

  req.log.info(
    { inspectionRequestId: created.id },
    "Inspection request created",
  );
  res.status(201).json(CreateInspectionRequestResponse.parse(created));
});

export default router;