import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import path from "path";
import connectDatabase from "./config/database.js"
import authRoute from "./routes/auth.route.js"

                                                                                                                                                              
dotenv.config();
connectDatabase()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://stylenest-ax2d.onrender.com"],   
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);


app.use(express.json());
app.use(cookieParser());

const _dirname = path.resolve()




// app.get("/", (req, res)=>{
//     res.send("home page")
// })

app.use("/api", authRoute)











app.use(express.static(path.join(_dirname, "/frontend/dist")))


app.get("/*", (req, res) => {
  res.sendFile(path.join(_dirname, "/frontend/dist/index.html"));
});



app.listen(PORT, () => {
  console.log(` App running on port ${PORT}`);
});
  
