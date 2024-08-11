const app = require("./app");
const PORT = process.env.PORT || 8000;

app.listen(PORT, (err)=>{
    if(err){
        console.log("Error in server: ",err);
        return
    }
    console.log("Server running at port: ", PORT)
});