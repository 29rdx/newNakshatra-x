import { NextResponse } from 'next/server'

export const MOIL_MINES = [
  { id: 'balaghat', numericId: 1, name: 'Balaghat', code: 'MOIL-BAL-01', state: 'MP', lat: 21.83, lng: 80.19, zone: 'Central India', targetTonnes: 18000, currentProduction: 16800 },
  { id: 'bharweli', numericId: 2, name: 'Bharweli', code: 'MOIL-BHR-02', state: 'MP', lat: 21.86, lng: 80.26, zone: 'Central India', targetTonnes: 14500, currentProduction: 12200 },
  { id: 'ukwa', numericId: 3, name: 'Ukwa', code: 'MOIL-UKW-03', state: 'MP', lat: 21.93, lng: 80.52, zone: 'Central India', targetTonnes: 9800, currentProduction: 8900 },
  { id: 'tirodi', numericId: 4, name: 'Tirodi', code: 'MOIL-TIR-04', state: 'MP', lat: 22.16, lng: 79.68, zone: 'Central India', targetTonnes: 11200, currentProduction: 10100 },
  { id: 'dongri-buzurg', numericId: 5, name: 'Dongri Buzurg', code: 'MOIL-DON-05', state: 'MH', lat: 20.99, lng: 79.34, zone: 'Western Belt', targetTonnes: 12000, currentProduction: 11200 },
  { id: 'chikla', numericId: 6, name: 'Chikla', code: 'MOIL-CHK-06', state: 'MH', lat: 21.30, lng: 79.66, zone: 'Western Belt', targetTonnes: 10800, currentProduction: 9800 },
  { id: 'mansar', numericId: 7, name: 'Mansar', code: 'MOIL-MAN-07', state: 'MH', lat: 21.44, lng: 79.25, zone: 'Western Belt', targetTonnes: 12500, currentProduction: 11800 },
  { id: 'kandri', numericId: 8, name: 'Kandri', code: 'MOIL-KAN-08', state: 'MH', lat: 21.38, lng: 79.32, zone: 'Western Belt', targetTonnes: 9300, currentProduction: 8400 },
  { id: 'gumgaon', numericId: 9, name: 'Gumgaon', code: 'MOIL-GUM-09', state: 'MH', lat: 21.33, lng: 79.03, zone: 'Western Belt', targetTonnes: 10200, currentProduction: 9600 },
  { id: 'beldongri', numericId: 10, name: 'Beldongri', code: 'MOIL-BEL-10', state: 'MH', lat: 21.16, lng: 79.18, zone: 'Western Belt', targetTonnes: 8600, currentProduction: 7800 },
]

export async function GET() {
  return NextResponse.json(MOIL_MINES)
}
