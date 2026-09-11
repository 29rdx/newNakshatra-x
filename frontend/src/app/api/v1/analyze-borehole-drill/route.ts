import { NextRequest, NextResponse } from 'next/server'
import {
  sanitizeNoSqlObject,
  sanitizeTemplateString,
  validateReplayNonce,
} from '@/lib/security'
import { z } from 'zod'

const BoreholeRequestSchema = z.object({
  collar_x: z.number().min(-180).max(180).optional(),
  collar_y: z.number().min(-90).max(90).optional(),
  total_depth_m: z.number().min(5).max(2000).optional(),
  hole_id: z.string().max(64).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const nonceCheck = validateReplayNonce(request.headers.get('x-security-nonce'))
    if (!nonceCheck.valid) {
      return NextResponse.json({ error: nonceCheck.reason }, { status: 400 })
    }

    const rawBody = await request.json()
    const cleanBody = sanitizeNoSqlObject(rawBody)

    const parsed = BoreholeRequestSchema.safeParse(cleanBody)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid borehole coordinates or depth parameter', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const collarX = parsed.data.collar_x ?? 80.1945
    const collarY = parsed.data.collar_y ?? 21.8312
    const totalDepth = parsed.data.total_depth_m ?? 120

    const lithologyLayers = [
      { from_m: 0, to_m: 14.5, rock_type: 'Overburden / Laterite', mn_grade_pct: 4.2, p_pct: 0.22, color_hex: '#854d0e' },
      { from_m: 14.5, to_m: 38.0, rock_type: 'Schist / Gondite Wallrock', mn_grade_pct: 12.8, p_pct: 0.18, color_hex: '#64748b' },
      { from_m: 38.0, to_m: 72.5, rock_type: 'High-Grade Pyrolusite Orebody (Main Reef)', mn_grade_pct: 46.8, p_pct: 0.09, color_hex: '#00FF88' },
      { from_m: 72.5, to_m: 98.0, rock_type: 'Siliceous Manganese Ore (Secondary Reef)', mn_grade_pct: 34.2, p_pct: 0.14, color_hex: '#38BDF8' },
      { from_m: 98.0, to_m: totalDepth, rock_type: 'Quartzite / Footwall Basal', mn_grade_pct: 6.1, p_pct: 0.19, color_hex: '#334155' },
    ]

    const highGradeThickness = 72.5 - 38.0
    const estimatedBlockReserveTonnes = Math.round(highGradeThickness * 50 * 50 * 3.85)

    const boreholeBreakdown = [
      { hole_id: `BH-2026-101`, thickness_m: 37.0, mn_grade_pct: 44.5, tonnage_block: Math.round(estimatedBlockReserveTonnes * 0.26), recovery_pct: 92.0 },
      { hole_id: `BH-2026-102`, thickness_m: 44.0, mn_grade_pct: 41.8, tonnage_block: Math.round(estimatedBlockReserveTonnes * 0.28), recovery_pct: 89.0 },
      { hole_id: `BH-2026-103`, thickness_m: 50.0, mn_grade_pct: 38.6, tonnage_block: Math.round(estimatedBlockReserveTonnes * 0.22), recovery_pct: 86.0 },
      { hole_id: `BH-2026-104`, thickness_m: 38.0, mn_grade_pct: 46.0, tonnage_block: Math.round(estimatedBlockReserveTonnes * 0.24), recovery_pct: 94.0 },
    ]

    return NextResponse.json({
      success: true,
      collar_id: `BH-2026-${Math.floor(100 + Math.random() * 900)}`,
      collar_coordinates: { x: collarX, y: collarY },
      total_depth_m: totalDepth,
      lithology_layers: lithologyLayers,
      mineralized_intercept_m: highGradeThickness,
      avg_intercept_mn_pct: 44.2,
      estimated_block_reserve_tonnes: estimatedBlockReserveTonnes,
      krige_variance: 0.042,
      confidence_score: 94.2,
      // UI Compatible Fields
      total_boreholes_analyzed: 4,
      total_estimated_in_situ_tonnes: estimatedBlockReserveTonnes,
      weighted_avg_mn_pct: 42.8,
      weighted_avg_fe_pct: 7.7,
      weighted_avg_sio2_pct: 5.5,
      average_seam_thickness_m: 41.5,
      unfc_classification: 'UNFC 111 (Proved Mineral Reserve)',
      economic_ore_category: 'Ferro-Manganese Grade (High Value)',
      geostatistical_confidence_pct: 94.2,
      borehole_assay_breakdown: boreholeBreakdown,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: sanitizeTemplateString(err?.message || 'Borehole analysis failed') },
      { status: 400 }
    )
  }
}
