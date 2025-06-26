import { createRequire } from 'module'
const  require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import dayjs from "dayjs";

import Subscription from "../models/subscription.model.js";

const REMINDERS = [7,5,2,1];

export const SendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") {return}

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal day has passed for subscription ${subscriptionId} stopping workflow`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');


        if (renewalDate.isAfter(dayjs())) {
            await sleepingUntilReminder(context, `reminder ${daysBefore} days before`, reminderDate)
        }
        await triggerReminder(context, `reminder ${daysBefore} days before`)
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    } );
};

const sleepingUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder for ${date}`);
    await context.sleepUntil(label,date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
        // send email
    });
}