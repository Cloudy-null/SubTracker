import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

/**
 * Creates a new subscription for the authenticated user
 * and triggers a reminder workflow
 */
export const createSubscription = async (req, res, next) => {
    try {
        // 1. Create new subscription in database
        const subscription = await Subscription.create({
            ...req.body,          // Spread all fields from request body
            user: req.user._id,   // Associate with authenticated user
        });

        // 2. Trigger reminder workflow in Upstash
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,  // Pass subscription ID to workflow
            },
            headers: {
                'Content-Type': 'application/json',
            },
            retries: 0,  // Don't retry if workflow fails
        });

        // 3. Return success response with created subscription
        res.status(201).json({
            status: true,
            data: {
                subscription,
                workflowRunId
            }
        });

    } catch (error) {
        next(error);  // Pass errors to error handling middleware
    }
};

/**
 * Gets all subscriptions for a specific user
 * Verifies the authenticated user matches the requested user
 */
export const getUserSubscriptions = async (req, res, next) => {
    try {
        // 1. Verify user authorization
        const requestedUserId = req.params.id;
        const authenticatedUserId = req.user._id.toString();

        if (authenticatedUserId !== requestedUserId) {
            console.log("Auth User ID:", authenticatedUserId);
            console.log("Requested User ID:", requestedUserId);

            const error = new Error("Unauthorized - You can only view your own subscriptions");
            error.status = 401;
            throw error;
        }

        // 2. Fetch subscriptions from database
        const subscriptions = await Subscription.find({
            user: requestedUserId
        });

        // 3. Return subscriptions
        res.status(200).json({
            status: true,
            data: subscriptions
        });

    } catch (error) {
        next(error);  // Pass errors to error handling middleware
    }
};