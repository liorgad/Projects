import { EligibilityCondition } from '../../classes';
import { EligibilityResult, EligibilityConfig, LoanApplicationResult, ConditionClassName } from '../../interfaces';
import { CreditScoreCondition, CrimeGradeCondition, MonthlyIncomeCondition } from './conditions';
export class EligibilityService {
	private conditionRegistry: Map<string, new (...args: any[]) => EligibilityCondition> = new Map();

	constructor() {
		// Register available condition types
		this.registerCondition(ConditionClassName.creditScore, CreditScoreCondition);
		this.registerCondition(ConditionClassName.crimeGrade, CrimeGradeCondition);
		this.registerCondition(ConditionClassName.monthlyIncome, MonthlyIncomeCondition);
	}

	private registerCondition(
		type: string,
		conditionClass: new (...args: any[]) => EligibilityCondition
	): void {
		this.conditionRegistry.set(type, conditionClass);
	}

	protected loadConditions(config: EligibilityConfig): EligibilityCondition[] {
		return config.conditions.filter(condConfig => condConfig.run).map(condConfig => {
			const ConditionClass = this.conditionRegistry.get(condConfig.type);

			if (!ConditionClass) {
				throw new Error(`Unknown condition type: ${condConfig.type}`);
			}
			// Instantiate			
			return new ConditionClass();
		});
	}

	protected checkEligibility(config: EligibilityConfig, loadApplicationResult: LoanApplicationResult): EligibilityResult[] {
		const conditions = this.loadConditions(config);
		return conditions.map(condition => condition.check(loadApplicationResult));
	}

	protected isFullyEligible(config: EligibilityConfig, loadApplicationResult: LoanApplicationResult): boolean {
		const results = this.checkEligibility(config, loadApplicationResult);
		return results.every(result => result.eligible);
	}

	public evaluateEligibility(loadApplicationResult: LoanApplicationResult): LoanApplicationResult {
		// Define configuration
		// TODO: get configuration from Database
		const config: EligibilityConfig = {
			conditions: [
				{ type: ConditionClassName.creditScore,run:true },
				{ type: ConditionClassName.crimeGrade, run: true },
				{ type: ConditionClassName.monthlyIncome, run: true },
			]
		};

		// Check if all conditions pass
		const fullyEligible = this.isFullyEligible(config, loadApplicationResult);
		loadApplicationResult.eligible = fullyEligible;
		if (fullyEligible) {			
			loadApplicationResult.reason = `Fully eligible: ${fullyEligible}`	
		} else {
			const results = this.checkEligibility(config, loadApplicationResult);
			results.forEach(result => {
				loadApplicationResult.reason += `${result.reason}, `;
			});
		}

		return loadApplicationResult;
	}
}

