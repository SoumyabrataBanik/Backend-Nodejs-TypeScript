import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId, // The one who is subscribing to the channel
            ref: "User",
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId, // The channel to which the subscriber is subscribing
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
