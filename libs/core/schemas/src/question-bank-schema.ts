import { z } from "zod";

export const questionBankNameSchema = z.enum(["737", "a320", "atpl"]);
