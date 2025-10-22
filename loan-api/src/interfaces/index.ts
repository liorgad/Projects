export interface LoanApplication {
	applicantName: string;
	propertyAddress: string;
	creditScore: number;
	monthlyIncome: number;
	requestedAmount: number;
	loanTermMonths: number;
}

export interface LoanApplicationResult extends LoanApplication {
	id: string;
	eligible: boolean;
	reason: string;
	crimeGrade: string;
}

// Result interface for eligibility checks
export interface EligibilityResult {
	eligible: boolean;
	reason: string;
}

export interface ValidationResult {
	valid: boolean;
	error: string;
}

export interface EligibilityConditionInterface {
	check(loanApplicationResult:LoanApplicationResult): EligibilityResult;
}

// Configuration interface
export interface ConditionConfig {
	type: string;
	run: boolean;
}

export interface EligibilityConfig {
	conditions: ConditionConfig[];
}


export enum ConditionClassName {
	creditScore = "CreditScoreCondition",
	crimeGrade = "CrimeGradeCondition",
	monthlyIncome = "MonthlyIncomeCondition"
}

