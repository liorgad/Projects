
import { Agent, createClient, REGION_EU} from "@relevanceai/sdk";
const sleep = (timeToSleep: number) => new Promise(resolve => setTimeout(resolve, timeToSleep));
(async () => {	
	console.log('Starting...');
	// Initialize client with your credentials
	const client = createClient({
		apiKey: process.env.RELEVANCE_API_KEY || "396ce30a-b94b-4646-9235-eecd688cb224:sk-N2IyMjFmYWEtMjliZC00MWRjLWIyMmYtZTA4MTg1NjM1YTM2",
		region: REGION_EU,
		// agentId: "ac972823-a507-4a2e-b347-56171fcffbb1",
		project: "d7b62b"
	});	

	const response = await client.fetch("/agents/ac972823-a507-4a2e-b347-56171fcffbb1/get");
	console.log(response);

	// Load an agent
	// const agent = await Agent.get("ac972823-a507-4a2e-b347-56171fcffbb1",client);
	// // Start a conversation
	// const task = await agent.sendMessage("call crimeagradeagent for address 558 Carlisle Way Sunnyvale CA 94087");
	// // Listen for agent responses
	// task.addEventListener("message", ({ detail: { message } }) => {
	// 	// use message helpers to determine the message
	// 	if (message.isAgent()) {
	// 		console.log("Agent:", message.text);
	// 	} else if (message.isUser()) {
	// 		console.log("User:", message.text);
	// 	} else if (message.isTool()) {
	// 		console.log("Tool:", message.status);
	// 	}
	// });

	// // catching errors
	// task.addEventListener("error", ({ detail: { message } }) => {
	// 	console.error("Task error:", message.lastError);
	// });
	
	// const response = await fetch('https://api-d7b62b.stack.tryrelevance.com/latest/agents/trigger', {
	// 	method: "POST",
	// 	headers: { "Content-Type": "application/json", "Authorization": "396ce30a-b94b-4646-9235-eecd688cb224:sk-N2IyMjFmYWEtMjliZC00MWRjLWIyMmYtZTA4MTg1NjM1YTM2" },
	// 	body: JSON.stringify({ "message": { "role": "user", "content": "call crimeagradeagent for address 558 Carlisle Way Sunnyvale CA 94087" }, "agent_id": "ac972823-a507-4a2e-b347-56171fcffbb1" })
	// })
	// const responseJ = await response.json();
	// console.log('Job ID:', responseJ.job_info.job_id);
	// await sleep(120000);
	// const responseJob = await fetch(`https://api.relevanceai.com/v1/jobs/${responseJ.job_info.job_id}`, {
	// 	headers: { "Content-Type": "application/json", "Authorization": "396ce30a-b94b-4646-9235-eecd688cb224:sk-N2IyMjFmYWEtMjliZC00MWRjLWIyMmYtZTA4MTg1NjM1YTM2" }
	// })
	// const responseJob = await fetch(`https://api-d7b62b.stack.tryrelevance.com/latest/jobs/25bb89bd-d4fa-4f04-a642-2feef6aac074`, {
	// 	headers: { "Content-Type": "application/json", "Authorization": "396ce30a-b94b-4646-9235-eecd688cb224:sk-N2IyMjFmYWEtMjliZC00MWRjLWIyMmYtZTA4MTg1NjM1YTM2" }
	// })
	// const responseJobJ = await responseJob.json();

	// console.log(responseJobJ)
})();