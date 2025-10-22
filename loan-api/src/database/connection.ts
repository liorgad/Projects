import mysql from 'mysql2/promise';
import { LoanApplicationResult } from '../interfaces';

class DatabaseConnection {
	private connection: mysql.Connection | null = null;

	async connect(): Promise<void> {
		try {
			this.connection = await mysql.createConnection({
				host: process.env.DB_HOST || 'localhost',
				port: parseInt(process.env.DB_PORT || '3306'),
				user: process.env.DB_USER || 'loan_user',
				password: process.env.DB_PASSWORD || 'loan_password',
				database: process.env.DB_NAME || 'loan_api',
				timezone: 'Z'
			});

			console.log('Connected to MySQL database');
		} catch (error) {
			console.error('Error connecting to database:', error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		if (this.connection) {
			await this.connection.end();
			this.connection = null;
			console.log('Disconnected from MySQL database');
		}
	}

	async saveLoanApplication(loanApplicationResult: LoanApplicationResult): Promise<void> {
		if (!this.connection) {
			throw new Error('Database connection not established');
		}

		const query = `
			INSERT INTO loan_applications (
				id, applicant_name, property_address, credit_score, 
				monthly_income, requested_amount, loan_term_months, 
				crime_grade, eligible, reason
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		const values = [
			loanApplicationResult.id,
			loanApplicationResult.applicantName,
			loanApplicationResult.propertyAddress,
			loanApplicationResult.creditScore,
			loanApplicationResult.monthlyIncome,
			loanApplicationResult.requestedAmount,
			loanApplicationResult.loanTermMonths,
			loanApplicationResult.crimeGrade,
			loanApplicationResult.eligible,
			loanApplicationResult.reason
		];

		await this.connection.execute(query, values);
	}

	async getLoanApplication(id: string): Promise<LoanApplicationResult | null> {
		if (!this.connection) {
			throw new Error('Database connection not established');
		}

		const query = 'SELECT * FROM loan_applications WHERE id = ?';
		const [rows] = await this.connection.execute(query, [id]);

		const result = rows as any[];
		if (result.length === 0) {
			return null;
		}

		const row = result[0];
		return {
			id: row.id,
			applicantName: row.applicant_name,
			propertyAddress: row.property_address,
			creditScore: row.credit_score,
			monthlyIncome: row.monthly_income,
			requestedAmount: row.requested_amount,
			loanTermMonths: row.loan_term_months,
			crimeGrade: row.crime_grade,
			eligible: row.eligible,
			reason: row.reason
		};
	}

	async getAllLoanApplications(): Promise<LoanApplicationResult[]> {
		if (!this.connection) {
			throw new Error('Database connection not established');
		}

		const query = 'SELECT * FROM loan_applications ORDER BY created_at DESC';
		const [rows] = await this.connection.execute(query);

		const result = rows as any[];
		return result.map(row => ({
			id: row.id,
			applicantName: row.applicant_name,
			propertyAddress: row.property_address,
			creditScore: row.credit_score,
			monthlyIncome: row.monthly_income,
			requestedAmount: row.requested_amount,
			loanTermMonths: row.loan_term_months,
			crimeGrade: row.crime_grade,
			eligible: row.eligible,
			reason: row.reason
		}));
	}
}

export default new DatabaseConnection();
