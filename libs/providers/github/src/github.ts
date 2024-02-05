import { Octokit } from "octokit";
import {
  getEnvVariableOrDefault,
  getEnvVariableOrThrow,
} from "@chair-flight/base/env";

interface GithubProvider {}

export class Github implements GithubProvider {
  private static octokit: Octokit;
  private static originOwner: string;
  private static originRepo: string;
  private static upstreamOwner: string;
  private static upstreamRepo: string;

  constructor() {
    Github.octokit = new Octokit({
      auth: getEnvVariableOrThrow("PROVIDER_GITHUB_TOKEN"),
    });
  }
}
