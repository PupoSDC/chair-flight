import { z } from "zod";

export const questionBankNameSchema = z.enum(["b737", "a320", "atpl", "prep"]);
