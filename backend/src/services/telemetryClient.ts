import { telemetryClient } from "./app-insights";

export async function trackUserAvatarUpdated(userId: string) {
  telemetryClient.trackEvent({
    name: "UserAvatarUpdated",
    properties: { userId },
  });
}
