import cron from "node-cron";
import { checkExpiredCampaigns } from "../controllers/campaign.controller";
cron.schedule("0 0 * * *", () => {
    console.log("checking for expiry campign .....")
   checkExpiredCampaigns();
   console.log("Expired campign updated")
});