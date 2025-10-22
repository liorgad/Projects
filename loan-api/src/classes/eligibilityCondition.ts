import { EligibilityResult } from "../interfaces";

// Base abstract condition class
export abstract class EligibilityCondition {
	abstract check(context: any): EligibilityResult;
}