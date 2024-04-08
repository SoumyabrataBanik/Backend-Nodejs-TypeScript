import * as dotenv from "dotenv";
import connectDB from "./db";
import { app } from "./app";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("MongoDB Connection Error: ", error);
            process.exit(1);
        });
        app.listen(port, () => {
            console.log(`Server running at: http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed.\n", error);
    });

/*
const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("Error: ", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`App running on: http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
})();
*/
