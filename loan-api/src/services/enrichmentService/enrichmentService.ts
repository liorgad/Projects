
import { v4 } from 'uuid';
import { LoanApplication, LoanApplicationResult } from '../../interfaces';
import { CrimeGradeService } from '../crimeGradeService';
export class EnrichmentService {
	private crimeGradeService: CrimeGradeService = new CrimeGradeService();
	async enrich(loanApplication: LoanApplication): Promise<LoanApplicationResult> {
		// Get crime grade
		const crimeGrade = await this.crimeGradeService.getCrimeGrade(loanApplication.propertyAddress);

		// Create loan application result
		const id = v4();		
		const loanApplicationResult: LoanApplicationResult = {
			id,
			...loanApplication,
			crimeGrade,
			eligible: false,
			reason: ''
		};

		return loanApplicationResult;
	}
}
