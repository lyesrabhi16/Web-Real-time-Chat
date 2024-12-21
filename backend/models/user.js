import db from "./db.js";

const UserSchema = new db.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    }
})

const User = db.model("User", UserSchema);

export default User;