import "dotenv/config";
import connectDB from "./db";

connectDB();

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
