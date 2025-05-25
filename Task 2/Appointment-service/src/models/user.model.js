const mongoose = require("mongoose");
const { Schema } = mongoose

const usersSchema = new Schema(
    {
        role: {
            type: String,
            enum: ['admin', 'organization', 'practitioner', 'patient'],
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
        }
    },
    {
        timestamps: true, versionKey: false
    }
);

const usersModel = mongoose.model("users", usersSchema);
module.exports = usersModel;