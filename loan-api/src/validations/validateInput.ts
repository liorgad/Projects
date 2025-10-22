import { LoanApplication, ValidationResult } from "../interfaces";

export class ValidateInput {
	static validate(loanApplication: any): ValidationResult {
		if (!loanApplication) {
			return {
				valid: false,
				error: 'Input is required'
			};        
		}
		// Validate required fields
		const requiredFields = ['applicantName', 'propertyAddress', 'creditScore', 'monthlyIncome', 'requestedAmount', 'loanTermMonths'];
		for (const field of requiredFields) {
			if (!loanApplication[field as keyof LoanApplication]) {
				return {
					valid: false,
					error: `Missing required field: ${field}`
				}
			}
		}
		return {
			valid: true,
			error: ''
		}
    }
}