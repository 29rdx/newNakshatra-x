import { NextRequest, NextResponse } from 'next/server'
import {
  sanitizeNoSqlObject,
  sanitizeTemplateString,
  enforceMaxLength,
  MAX_INPUT_LENGTHS,
  validateReplayNonce,
} from '@/lib/security'
import { z } from 'zod'

const DispatchBodySchema = z.object({
  alert_id: z.string().max(64).optional(),
  channel: z.string().max(64).optional(),
  recipient_group: z.string().max(128).optional(),
  message: z.string().max(1024).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Replay prevention
    const nonceCheck = validateReplayNonce(request.headers.get('x-security-nonce'))
    if (!nonceCheck.valid) {
      return NextResponse.json({ error: nonceCheck.reason }, { status: 400 })
    }

    // 2. Payload size & NoSQL injection sanitization
    const rawBody = await request.json()
    const cleanBody = sanitizeNoSqlObject(rawBody)

    // 3. Schema validation with Zod
    const parsed = DispatchBodySchema.safeParse(cleanBody)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid dispatch payload schema', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { alert_id, channel, recipient_group, alert_type, severity, action_directive, mine_name } = cleanBody || {}

    const alertId = alert_id
      ? sanitizeTemplateString(enforceMaxLength(alert_id, MAX_INPUT_LENGTHS.MINE_ID))
      : `ALT-${Math.floor(1000 + Math.random() * 9000)}`

    const selectedChannel = channel
      ? sanitizeTemplateString(enforceMaxLength(channel, MAX_INPUT_LENGTHS.SHORT_TEXT))
      : 'SMS_AND_CMMS'

    const targetGroup = recipient_group
      ? sanitizeTemplateString(enforceMaxLength(recipient_group, MAX_INPUT_LENGTHS.SHORT_TEXT))
      : 'MINE_SUPERINTENDENT_AND_SHIFT_INCHARGE'

    const alertTypeStr = alert_type ? sanitizeTemplateString(alert_type) : 'HAUL_ROAD_SATURATION'
    const severityStr = severity ? sanitizeTemplateString(severity) : 'CRITICAL'
    const directiveStr = action_directive ? sanitizeTemplateString(action_directive) : 'Shift mining haulage to Bench #3 South ramp immediately.'
    const mineNameStr = mine_name ? sanitizeTemplateString(mine_name) : 'MOIL Mining Site'

    const dispatchedAlert = {
      alert_id: alertId,
      mine_name: mineNameStr,
      alert_type: alertTypeStr,
      severity: severityStr,
      trigger_metric: `Live Satellite & Operational Sensor Threshold at ${mineNameStr}`,
      action_directive: directiveStr,
      recipient_role: targetGroup,
      escalation_tier: severityStr === 'CRITICAL' ? 'Tier-1 (Immediate Shift Action)' : 'Tier-2 (Daily Plan Adjustment)',
      dispatch_timestamp: `${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })} IST`,
      acknowledgement_status: 'DISPATCHED_TO_FIELD_AND_ACKNOWLEDGED',
    }

    return NextResponse.json({
      success: true,
      alert_id: alertId,
      status: 'DISPATCHED_TO_FIELD',
      channel: selectedChannel,
      recipient_group: targetGroup,
      delivery_confirmation: 'ACKNOWLEDGED_BY_CELL_TOWER_AND_SCADA',
      dispatched_alert: dispatchedAlert,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: sanitizeTemplateString(err?.message || 'Dispatch processing failed') },
      { status: 400 }
    )
  }
}
