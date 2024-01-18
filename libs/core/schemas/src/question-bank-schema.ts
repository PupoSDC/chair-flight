import { z } from "zod";

export const questionBankNameSchema = z.enum(["type", "atpl", "prep"]);
