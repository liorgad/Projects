import { EligibilityCondition } from "../../../classes";
import { EligibilityResult, LoanApplicationResult } from "../../../interfaces";

export class CrimeGradeCondition extends EligibilityCondition {
	check(loanApplicationResult: LoanApplicationResult): EligibilityResult {
		const { crimeGrade } = loanApplicationResult
		const eligible = crimeGrade != "F";
		return {
			eligible: eligible,
			reason: eligible
				? ``
				: `Crime Grade ${crimeGrade} is F }`
		};
	}
}