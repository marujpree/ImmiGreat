import Anthropic from '@anthropic-ai/sdk'

// Singleton client — reused across requests in the same server process
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Send a single user message and return the assistant's text response.
 *
 * @param {string} userMessage
 * @param {string} [systemPrompt]
 * @returns {Promise<string>}
 */
export async function askClaude(userMessage, systemPrompt) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system:
      systemPrompt ??
      `You are CitizenReady, an AI assistant that helps immigrants prepare for the
US Citizenship and Naturalization Test (USCIS N-400). You explain civics
questions clearly, provide study tips, and offer guidance on settling in the USA.
Always be encouraging, accurate, and respectful of diverse backgrounds.`,
    messages: [{ role: 'user', content: userMessage }],
  })

  return message.content[0].text
}

/**
 * Stream a response from Claude and yield text chunks.
 * Use this for streaming API routes.
 *
 * @param {string} userMessage
 * @param {string} [systemPrompt]
 * @returns {AsyncIterable<string>}
 */
export async function* streamClaude(userMessage, systemPrompt) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system:
      systemPrompt ??
      `You are CitizenReady, an AI assistant that helps immigrants prepare for the
US Citizenship and Naturalization Test (USCIS N-400). You explain civics
questions clearly, provide study tips, and offer guidance on settling in the USA.
Always be encouraging, accurate, and respectful of diverse backgrounds.`,
    messages: [{ role: 'user', content: userMessage }],
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}

export { anthropic }
