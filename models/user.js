const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            required: true,
            type: String
        },
        email: {
            required: true,
            type: String
        },
        password: {
            required: true,
            type: String
        },
    },
    {
        timestamps: true
    }
    );
    
    const User = model("users", userSchema);
    
    module.exports = User;