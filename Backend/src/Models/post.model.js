import mongoose, { Schema } from "mongoose";
// steps
// define post schema with fields: title, content, indexedDBmage, status, author
// add timestamps to the schema
// export the Post model
const posrSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        indexedDBmage: {
            type: String, // cloudinary url
            required: true
        },
        status: {
            type: String,
            enum: ["active", "inactive"], // Restricted to these two values
            default: "active"            // Sets a default for new posts
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, {
    timestamps: true
}
)

export const Post = mongoose.model("Post", posrSchema);