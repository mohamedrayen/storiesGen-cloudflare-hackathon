export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env) {

		const url = new URL(request.url);



		if (request.method === "OPTIONS") {
			// Handle CORS preflight requests
			return this.handleOptions(request);
		} else if (
			request.method === "GET" ||
			request.method === "HEAD" ||
			request.method === "POST"
		) {
			// Handle requests to the API server
			return this.handleRequest(request, env);
		} else {
			return new Response(null, {
				status: 405,
				statusText: "Method Not Allowed",
			});
		}

	},
	 async handleOptions (request: Request) {
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
			"Access-Control-Max-Age": "86400",
		};
		if (
			request.headers.get("Origin") !== null &&
			request.headers.get("Access-Control-Request-Method") !== null &&
			request.headers.get("Access-Control-Request-Headers") !== null
		) {
			// Handle CORS preflight requests.
			return new Response(null, {
				headers: {
					...corsHeaders,
					"Access-Control-Allow-Headers": request.headers.get(
						"Access-Control-Request-Headers"
					),
				},
			});
		} else {
			// Handle standard OPTIONS request.
			return new Response(null, {
				headers: {
					Allow: "GET, HEAD, POST, OPTIONS",
				},
			});
		}
	},
	async handleRequest(request: Request, env: Env) {

		let { query } = await request.json();

		const topic_detector_messages = [
			{
				role: "system", content:
					`follow the instruction :
you are topic detector,
dont talk alot,
answer in one phrase what is the scientific topic user talking about.`
			},
			{
				role: "user",
				content: `follow the instructions:
detect from the text provided the scientific topic that not understanded.
the text: "${query}"
the output structure:the_specific_topic`,
			},
		];

		const topic = await env.AI.run("@hf/mistralai/mistral-7b-instruct-v0.2", { messages: topic_detector_messages });

		const story_messages = [
			{ role: "system", content: "you are a story generator" },
			{
				role: "user",
				content: `follow this instructions :
let topic is ${topic.response},
Explore the practical applications of the ${topic.response} in life.\nProvide a story that showcasing where understanding ${topic.response} becomes essential.
the output:the_story`,
			},
		];

		const response = await env.AI.run("@cf/meta/llama-2-7b-chat-fp16", { messages: story_messages });
		let headers = {
			"Access-Control-Allow-Origin": "*",

		};
		return Response.json(response, {
			headers: {
				...headers
			}
		});
}
};