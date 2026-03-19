import cron from "node-cron"
import { JobOpportunity } from "../models/jobOppertunity.model.js"

cron.schedule("0 0 * * *", async () => {
    console.log("Checking expired jobs...")

    await JobOpportunity.updateMany(
        { deadline: { $lt: new Date() } },
        { status: "expired" }
    )

    console.log("Expired jobs updated")
})