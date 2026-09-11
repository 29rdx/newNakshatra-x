import { NextResponse } from 'next/server'
import { getCombinedHistoricalAndFutureData } from '@/lib/historical-database'

export async function GET() {
  const data = getCombinedHistoricalAndFutureData()
  return NextResponse.json({
    success: true,
    ...data,
    query_timestamp: new Date().toISOString(),
    engine: 'NAKSHATRA-X Historical Database & Prophet/XGBoost 2040 Forecast Kernel',
  })
}
