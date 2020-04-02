const mongo = require("../database");

const { Schema } = mongo;

const FileSchema = require("./FileSchema");

const UserSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            select: false,
            required: true
        },
        photo: {
            type: FileSchema,
        },
        animes: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

require("./preActions/user")(UserSchema);

module.exports = mongo.model("User", UserSchema);