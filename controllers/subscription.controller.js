import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        console.log("📩 Creating subscription for user:", req.user);
        console.log("📦 Body:", req.body);

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user
        });

        console.log("✅ Subscription created:", subscription);
        res.status(201).json({ status: true, data: subscription });
    } catch (error) {
        console.error("❌ Subscription error:", error);
        next(error);
    }
}
