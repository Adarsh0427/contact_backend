import express , {Request , Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import identifyRouter from "./routes/identify";
import { identitySchema} from "./utils/validation";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/identify", (req: Request, res: Response) => {
    const result = identitySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.issues });
    }
    res.status(200).json({ message: "Request is valid"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
