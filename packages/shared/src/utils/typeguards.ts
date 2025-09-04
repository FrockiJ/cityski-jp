import { CreateLineAccount } from "src/constants/auth";

// custom type guard to check if result is the type that prompts for client to create an account
export function isCreateLineAccount(result: any): result is CreateLineAccount {
  return "status" in result && result.status === "CREATE_ACCOUNT";
}
