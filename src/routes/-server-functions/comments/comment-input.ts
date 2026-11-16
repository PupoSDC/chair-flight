import { z } from "zod";
import { MAX_COMMENT_LENGTH } from "../../../libs/core/community/comment";

export const COMMENT_BODY_SCHEMA = z
  .string()
  .trim()
  .min(1, "Write something first.")
  .max(MAX_COMMENT_LENGTH, "That comment is too long.");
