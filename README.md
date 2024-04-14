# LearnWhy: Story Generation Cloudflare Worker

### Cloudflare Hackathon:
This Cloudflare Worker is part of the LearnWhy project developed for the Cloudflare AI Challenge.

### Description:
This Cloudflare Worker handles the generation of real-world stories in response to user input from the LearnWhy application. It leverages the @cf/meta/llama-2-7b-chat-fp16 model to craft narratives that highlight the necessity of understanding complex scientific concepts.

### Workflow:
1. **Receive User Input**: The worker receives text input from the LearnWhy frontend, expressing the user's struggles with understanding scientific topics.
2. **Generate Story**: Utilizing the @cf/meta/llama-2-7b-chat-fp16 model, the worker generates a real-world story that illustrates the importance of the identified concept.
3. **Return Story**: The generated story is returned as a response to the frontend, ready to be presented to the user.

### Installation:
1. Clone this repository.
2. Install dependencies using npm: `npm install`.
3. Deploy the worker to your Cloudflare account using Wrangler: `wrangler publish`.
