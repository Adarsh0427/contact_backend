import {findByEmail, findByPhone} from "../models/identify";
import { Identity, identitySchema } from "../utils/validation";

const handleIdentify = async (req: Request, res: Response) => {
    const detail = identitySchema.safeParse(req.body);
}