import express, { Request, Response, Express } from 'express';
import { apiKeyAuth } from './middleware/auth';
import database from './database/connection';
import { LoanApplication } from './interfaces';
import { ValidateInput } from './validations';
import { EligibilityService, EnrichmentService } from './services';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Services
const enrichmentService = new EnrichmentService();
const eligibilityService = new EligibilityService();

// Initialize database connection
database.connect().catch(console.error);

app.use(express.json());

// POST /loan - Submit and evaluate loan application
app.post('/loan', apiKeyAuth, async (req: Request, res: Response) => {
	try {
		const loanApplication: LoanApplication = req.body;

		// Validate input body
		const validationResult = ValidateInput.validate(loanApplication);
		if (!validationResult.valid) {
			return res.status(400).json({ error: validationResult.error });
		}	

		const enrichedLoanApllication = await enrichmentService.enrich(loanApplication);

		// Evaluate eligibility
		const eligibilityResult = eligibilityService.evaluateEligibility(enrichedLoanApllication);
	
		// Store application in database
		await database.saveLoanApplication(enrichedLoanApllication);

		res.status(201).json({			
			eligible: eligibilityResult.eligible,
			reason: eligibilityResult.reason
		});

	} catch (error) {
		console.error('Error processing loan application:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /loan/:id - Retrieve loan application
app.get('/loan/:id', apiKeyAuth, async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const loanApplication = await database.getLoanApplication(id);
		if (!loanApplication) {
			return res.status(404).json({ error: 'Loan application not found' });
		}

		res.json(loanApplication);
	} catch (error) {
		console.error('Error retrieving loan application:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});


const server = app.listen(PORT, () => {
	console.log(`Loan Eligibility API running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
	console.log('SIGTERM received, shutting down gracefully');
	server.close(() => {
		console.log('Process terminated');
	});
	await database.disconnect();
});

process.on('SIGINT', async () => {
	console.log('SIGINT received, shutting down gracefully');
	server.close(() => {
		console.log('Process terminated');
	});
	await database.disconnect();
});

export { app };
