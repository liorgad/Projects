import { EligibilityCondition } from "../../../classes";
import { EligibilityResult, LoanApplicationResult } from "../../../interfaces";

export class MonthlyIncomeCondition extends EligibilityCondition {
	check(loanApplicationResult: LoanApplicationResult): EligibilityResult {
		const { monthlyIncome, requestedAmount, loanTermMonths } = loanApplicationResult
		const eligible = monthlyIncome > (requestedAmount / loanTermMonths) * 1.5;
		return {
			eligible: eligible,
			reason: eligible
				? ``
				: `Monthly Income ${monthlyIncome} is lower or equal than ${(requestedAmount / loanTermMonths) * 1.5}`
		};
	}
}