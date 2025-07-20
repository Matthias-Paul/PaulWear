import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import path from "path";

  
import connectDatabase from "./config/database.js"
import authRoute from "./routes/auth.route.js"
import productRoute from "./routes/product.route.js"
import cartRoute from "./routes/cart.route.js"
import checkoutRoute from "./routes/checkout.route.js"
import orderRoute from "./routes/order.route.js"
import uploadRoute from "./routes/upload.route.js"
import subscribeRoute from "./routes/subscriber.route.js"
import adminRoute from "./routes/admin.route.js"
import vendorRoute from "./routes/vendor.route.js"
import paymentRoute from "./routes/payment.route.js"
import productReviewRoute from "./routes/productReview.route.js"
import tokenRoute from "./routes/token.route.js"

                                                                                                                                                              
dotenv.config();
connectDatabase()

const app = express();
const PORT = process.env.PORT || 8000;




app.use(cookieParser());

app.use(         
  cors({    
    origin: ["http://localhost:5173", "https://stylenest-ax2d.onrender.com"],   
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);          
     
app.use("/api", paymentRoute)

app.use(express.json());
    

const _dirname = path.resolve()
 
      


// app.get("/", (req, res)=>{
//     res.send("home page")
// })

app.use("/api", authRoute)
app.use("/api", productRoute)
app.use("/api", cartRoute)
app.use("/api", checkoutRoute)
app.use("/api", orderRoute)
app.use("/api", uploadRoute)
app.use("/api", subscribeRoute)
app.use("/api", adminRoute)  
app.use("/api", vendorRoute)
app.use("/api", productReviewRoute)
app.use("/api", tokenRoute)












app.use(express.static(path.join(_dirname, "/frontend/dist")))


app.get("/*", (req, res) => {
  res.sendFile(path.join(_dirname, "/frontend/dist/index.html"));
});



app.listen(PORT, () => {
  console.log(` App running on port ${PORT}`);
});
  
