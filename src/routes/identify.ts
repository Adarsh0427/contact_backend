import express , { Request, Response } from "express";
import {responseSchema, identitySchema}  from "../utils/validation";

const identifyRouter = express.Router();

identifyRouter.post("/", (req: Request, res: Response) => {
    const result = identitySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.issues });
    }
    
});

export default identifyRouter;
