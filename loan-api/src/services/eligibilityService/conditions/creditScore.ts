import { EligibilityCondition } from "../../../classes";
import { EligibilityResult, LoanApplicationResult } from "../../../interfaces";

export class CreditScoreCondition extends EligibilityCondition {	
	check(loanApplicationResult: LoanApplicationResult): EligibilityResult {
		const { creditScore } = loanApplicationResult
		const eligible = creditScore >= 700;
		return {
			eligible: eligible,
			reason: eligible
				? ``
				: `CreditScore ${creditScore} is below 700`
		};
	}
}