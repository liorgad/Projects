import { EligibilityService } from '../src/services/eligibilityService';
import { LoanApplicationResult } from '../src/interfaces';

describe('EligibilityService', () => {	

	test('should approve eligible applicant', () => {
		const eligibilityService = new EligibilityService();
		const application: LoanApplicationResult = {
			id: 'test-id-1',
			applicantName: 'John Doe',
			propertyAddress: '123 Main St',
			creditScore: 750,
			monthlyIncome: 10000,
			requestedAmount: 150000,
			loanTermMonths: 24,
			crimeGrade: 'A',
			eligible: false,
			reason: ''
		};

		const result = eligibilityService.evaluateEligibility(application);

		expect(result.eligible).toBe(true);
		expect(result.reason).toContain('Fully eligible');
	});

	test('should reject applicant with low credit score', () => {
		const eligibilityService = new EligibilityService();
		const application: LoanApplicationResult = {
			id: 'test-id-2',
			applicantName: 'John Doe',
			propertyAddress: '123 Main St',
			creditScore: 650,
			monthlyIncome: 10000,
			requestedAmount: 150000,
			loanTermMonths: 24,
			crimeGrade: 'A',
			eligible: false,
			reason: ''
		};

		const result = eligibilityService.evaluateEligibility(application);

		expect(result.eligible).toBe(false);
		expect(result.reason).toContain('CreditScore 650 is below 700');
	});

	test('should reject applicant with high crime grade', () => {
		const eligibilityService = new EligibilityService();
		const application: LoanApplicationResult = {
			id: 'test-id-3',
			applicantName: 'John Doe',
			propertyAddress: '123 Main St',
			creditScore: 750,
			monthlyIncome: 10000,
			requestedAmount: 150000,
			loanTermMonths: 24,
			crimeGrade: 'F',
			eligible: false,
			reason: ''
		};

		const result = eligibilityService.evaluateEligibility(application);

		expect(result.eligible).toBe(false);
		expect(result.reason).toContain('Crime Grade F is F');
	});
});
