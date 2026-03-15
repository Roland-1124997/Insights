import { randomUUID } from "crypto";
import chalk from "chalk";

export default defineTask({
    meta: {
        name: "wake-up",
        description: "Send a push event to the service worker to keep it alive and prevent cold starts",
    },
    async run() {

        console.log(`\n${chalk.black('[wake-up]')} Running at: ${chalk.black(new Date().toLocaleString())}`);
    
        useSendServiceWorkerPushEvent({
            data: { id: randomUUID() },
            events: { sync: true  }
        });

        return { result: "Success" };

    },
});
