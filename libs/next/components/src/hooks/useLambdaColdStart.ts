import { useEffect } from "react";
import { default as axios } from "axios";
import { getRandomId } from "@chair-flight/core/app";

let hasColdStarted = false;

/**
 * Cold start critical lambdas that take a long time to load,
 * in the hopes that the user takes some time to get to them...
 */
export const useLambdaColdStart = () => {
  useEffect(() => {
    if (hasColdStarted) return;
    const q = getRandomId();
    axios.get("/api/search/questions", { params: { q } });
    hasColdStarted = true;
  }, []);
};
