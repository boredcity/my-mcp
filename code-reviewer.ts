import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { fetchWeatherApi } from 'openmeteo'
import { z } from 'zod'
import { readFileSync } from 'fs'

const markdownPath = '/Users/merelj/personal/MCP/my-mcp/styleguide.md'
const markdown = readFileSync(markdownPath, 'utf-8')

const server = new McpServer({
    name: 'code-reviewer-mcp',
    version: '1.0.3',
    description: 'Code review server'
})

server.registerTool(
    'multiply',
    {
        title: 'Multiplication tool',
        description: 'Multiply two numbers',
        inputSchema: {
            a: z.number(),
            b: z.number()
        }
    },
    async ({ a, b }: { a: number; b: number }) => ({
        content: [{ type: 'text', text: `${a * b}` }]
    })
)

server.registerPrompt(
    'review-code',
    {
        title: 'Code Review',
        description: 'Review code for best practices and potential issues',
        argsSchema: { code: z.string() }
    },
    ({ code }) => ({
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `
Review this code to see if it follows best practices. Use this style guide as reference and the rules:

=========

${markdown}

=========

Code to review:
${code}

`
                }
            }
        ]
    })
)

const transport = new StdioServerTransport()

await server.connect(transport)
