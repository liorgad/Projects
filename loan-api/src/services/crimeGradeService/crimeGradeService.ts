export class CrimeGradeService {
	async getCrimeGrade(address: string): Promise<string> {
		try {
			// for some reason need to manage the state of the agent since getting that agent start running, so still need to research that
			
			// const response = await fetch('https://api-d7b62b.stack.tryrelevance.com/latest/agents/trigger', {
			// 	method: "POST",
			// 	headers: { "Content-Type": "application/json", "Authorization": process.RELEVANCE_API_KEY },
			// 	body: JSON.stringify({ "address": address, "agent_id": "ac972823-a507-4a2e-b347-56171fcffbb1" })
			// })
			// const response = await response.json();	

			// For now, return a mock grade based on address
			// Mock implementation - replace with actual API call
			const mockGrades = ['A', 'B', 'C', 'D', 'F'];
			const randomGrade = mockGrades[Math.floor(Math.random() * mockGrades.length)];

			return randomGrade;
		} catch (error) {
			console.error('Error fetching crime grade:', error);
			return 'C'; // Default grade on error
		}
	}
}
