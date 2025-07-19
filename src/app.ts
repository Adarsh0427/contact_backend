import express , {Request , Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import identifyRoute from "./routes/identify";
import { identitySchema} from "./utils/validation";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// handle request from any origin
app.use(cors({
    origin: "*",
    methods: ["POST"],
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/identify", identifyRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
