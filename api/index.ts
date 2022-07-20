import { parseRequest } from './_lib/parser'
import { getScreenshot } from './_lib/chromium'
import { getHtml } from './_lib/template'
import { Handler } from '@netlify/functions'
import { Buffer } from 'buffer'

const isHtmlDebug = process.env.OG_HTML_DEBUG === '1'

export const handler: Handler = async (event, ctx) => {
  const isDev = !ctx.clientContext?.custom?.netlify
  try {
    const parsedReq = parseRequest(event)
    const html = getHtml(parsedReq)
    if (isHtmlDebug) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': '',
        },
        body: html,
      }
    }
    const { fileType } = parsedReq
    const file = await getScreenshot(html, fileType, isDev)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': `image/${fileType}`,
        'Cache-Control': `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
      },
      body: Buffer.from(file).toString('base64'),
      isBase64Encoded: true,
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': '',
      },
      body: '<h1>Internal Error</h1><p>Sorry, there was a problem</p>',
    }
  }
}
