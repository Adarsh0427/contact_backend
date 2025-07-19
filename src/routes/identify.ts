import express , { Request, Response } from "express";
import {responseSchema, identitySchema}  from "../utils/validation";
import { handleIdentify } from "../controllers/identity";

const router = express.Router();

router.post("/", handleIdentify);

export default router;
