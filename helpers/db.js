const mongoose = require("mongoose");

async function mongoConnect() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(
            "MongoDB connected Sucessfulyy :) ",
            connection.connection.host,
        );
    } catch (err) {
        if (err) {
            console.log("Error Connecting with DB");
            console.log("uri: ", process.env.MONGODB_URI);
            console.log(`Error is: ${err.message}`);
            process.exit();
        }
    }
}

module.exports = mongoConnect;
