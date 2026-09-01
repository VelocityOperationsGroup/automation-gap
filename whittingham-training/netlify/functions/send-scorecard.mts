import { json } from './_shared/http.mts'
import { scorecardHtml, scorecardSubject, scorecardText } from '../../shared/emailTemplate.ts'
import type { RubricScore, ScorecardEmailRequest, ScorecardEmailResponse } from '../../shared/types.ts'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_FROM = 'Whittingham Agency Worksite Trainer <onboarding@resend.dev>'

function isValidReport(report: unknown): report is ScorecardEmailRequest['report'] {
  if (!report || typeof report !== 'object') return false
  const r = report as Record<string, unknown>
  return (
    typeof r.overallScore === 'number' &&
    typeof r.overallMaxScore === 'number' &&
    typeof r.headline === 'string' &&
    Array.isArray(r.rubric) &&
    r.rubric.every(
      (item): item is RubricScore =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as RubricScore).category === 'string' &&
        typeof (item as RubricScore).score === 'number' &&
        typeof (item as RubricScore).maxScore === 'number' &&
        typeof (item as RubricScore).feedback === 'string',
    ) &&
    Array.isArray(r.strengths) &&
    Array.isArray(r.improvements) &&
    Array.isArray(r.scriptDeviations) &&
    typeof r.nextDrill === 'string'
  )
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('send-scorecard: RESEND_API_KEY is not set')
    return json({ error: 'Email sending is not configured on this deployment yet.' }, { status: 501 })
  }

  let body: ScorecardEmailRequest
  try {
    body = (await req.json()) as ScorecardEmailRequest
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, scenario, report } = body
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return json({ error: 'Enter a valid email address.' }, { status: 400 })
  }
  if (!scenario?.businessId || !scenario.agentName) {
    return json({ error: 'Missing scenario fields' }, { status: 400 })
  }
  if (!isValidReport(report)) {
    return json({ error: 'Missing or malformed scorecard' }, { status: 400 })
  }

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM

  let resendRes: Response
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email.trim()],
        subject: scorecardSubject(scenario, report),
        html: scorecardHtml(scenario, report),
        text: scorecardText(scenario, report),
      }),
    })
  } catch (err) {
    console.error('send-scorecard: network error calling Resend', err)
    return json({ error: 'Could not reach the email service. Try again in a moment.' }, { status: 502 })
  }

  if (!resendRes.ok) {
    const errBody = await resendRes.text().catch(() => '')
    console.error('send-scorecard: Resend API error', resendRes.status, errBody)
    return json({ error: 'The email service rejected the request. Try again in a moment.' }, { status: 502 })
  }

  const result: ScorecardEmailResponse = { ok: true }
  return json(result)
}
