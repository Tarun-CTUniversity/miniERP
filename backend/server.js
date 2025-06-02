const app = require("./app");
const { connectDatabase } = require("./src/database/connectdatabase");
const { errorHandler } = require("./src/middleware/errorMiddleWare");
const basicInfoRouter = require("./src/routers/basicInfoRouters")
const teacherRouter = require("./src/routers/teacherRouter");
const loginRouter = require("./src/routers/loginRouter");
const sessionModel = require("./src/database/models/AcadmicModel/sessionModel");
// COnnect the Database
connectDatabase();


// Routers
app.use("/api/v1/basicInfo",basicInfoRouter);
app.use("/api/v1/teacher",teacherRouter);
app.use("/api/v1/login",loginRouter);

app.get("*",(req,res,next)=>{
    res.status(404).send("Server is connected but Page not found");
})



// Use ErrorMiddleware
app.use(errorHandler);

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})