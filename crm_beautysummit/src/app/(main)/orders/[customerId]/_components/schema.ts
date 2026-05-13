// src/app/(main)/dashboard/default/_components/schema.ts
import { z } from "zod";

import { channelSchema } from "../../_components/schema";

// For the nested orders view we reuse the parent orders schema.
// Export under the expected names so existing imports keep working.
export const videoSchema = channelSchema;
export type Video = z.infer<typeof videoSchema>;
