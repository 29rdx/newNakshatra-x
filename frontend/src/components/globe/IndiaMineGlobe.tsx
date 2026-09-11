'use client'

import { useEffect, useRef } from 'react'

type Hotspot = {
  id: string
  name: string
  longitude: number
  latitude: number
  score: number
  category: 'priority_validation' | 'investigate' | 'monitor'
  confidence: number
  ndvi: number
  soilMoisture: number
  landTemp: number
  rainfall14d: number
  source: string
  lastObservation: string
  cloudCover: number
}

const MINE_DATA: Hotspot[] = [
  { id: 'balaghat', name: 'Balaghat', longitude: 80.19, latitude: 21.83, score: 87, category: 'priority_validation', confidence: 87, ndvi: 0.72, soilMoisture: 42, landTemp: 34.2, rainfall14d: 118, source: 'Sentinel-2', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 8 },
  { id: 'bharweli', name: 'Bharweli', longitude: 80.26, latitude: 21.86, score: 74, category: 'investigate', confidence: 74, ndvi: 0.68, soilMoisture: 38, landTemp: 33.8, rainfall14d: 95, source: 'Landsat-8', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 12 },
  { id: 'ukwa', name: 'Ukwa', longitude: 80.52, latitude: 21.93, score: 62, category: 'investigate', confidence: 62, ndvi: 0.64, soilMoisture: 35, landTemp: 35.1, rainfall14d: 78, source: 'Sentinel-2', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 22 },
  { id: 'tirodi', name: 'Tirodi', longitude: 79.68, latitude: 22.16, score: 71, category: 'investigate', confidence: 71, ndvi: 0.69, soilMoisture: 40, landTemp: 33.5, rainfall14d: 105, source: 'Sentinel-2', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 5 },
  { id: 'dongri-buzurg', name: 'Dongri Buzurg', longitude: 79.34, latitude: 20.99, score: 58, category: 'investigate', confidence: 58, ndvi: 0.61, soilMoisture: 33, landTemp: 36.4, rainfall14d: 62, source: 'Landsat-8', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 18 },
  { id: 'chikla', name: 'Chikla', longitude: 79.66, latitude: 21.3, score: 66, category: 'investigate', confidence: 66, ndvi: 0.65, soilMoisture: 37, landTemp: 35.8, rainfall14d: 88, source: 'Sentinel-2', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 14 },
  { id: 'mansar', name: 'Mansar', longitude: 79.25, latitude: 21.44, score: 78, category: 'priority_validation', confidence: 78, ndvi: 0.71, soilMoisture: 41, landTemp: 34.0, rainfall14d: 112, source: 'Sentinel-2', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 6 },
  { id: 'kandri', name: 'Kandri', longitude: 79.32, latitude: 21.38, score: 55, category: 'monitor', confidence: 55, ndvi: 0.59, soilMoisture: 31, landTemp: 36.8, rainfall14d: 54, source: 'Landsat-8', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 28 },
  { id: 'gumgaon', name: 'Gumgaon', longitude: 79.03, latitude: 21.33, score: 69, category: 'investigate', confidence: 69, ndvi: 0.66, soilMoisture: 36, landTemp: 35.5, rainfall14d: 92, source: 'Sentinel-2', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 10 },
  { id: 'beldongri', name: 'Beldongri', longitude: 79.18, latitude: 21.16, score: 48, category: 'monitor', confidence: 48, ndvi: 0.56, soilMoisture: 29, landTemp: 37.2, rainfall14d: 48, source: 'Landsat-8', lastObservation: '2026-08-28T14:30:00Z', cloudCover: 32 },
]

function getCategoryColor(cat: string) {
  switch (cat) {
    case 'priority_validation': return '#E5C76B'
    case 'investigate': return '#D99A3A'
    default: return '#3FAE7A'
  }
}

export default function IndiaMineGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let mounted = true

    import('cesium').then((Cesium) => {
      if (!mounted || !containerRef.current) return

      ;(window as any).CESIUM_BASE_URL = '/cesium/'

      const viewer = new Cesium.Viewer(containerRef.current, {
        animation: false,
        timeline: false,
        geocoder: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        homeButton: false,
        infoBox: true,
        sceneModePicker: false,
        fullscreenButton: false,
        selectionIndicator: true,
        shouldAnimate: true,
      })

      viewerRef.current = viewer

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(82.5, 22.5, 5_400_000),
        duration: 0,
      })

      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#050607')
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#080A0D')

      try {
        viewer.imageryLayers.removeAll()
        viewer.imageryLayers.addImageryProvider(
          new Cesium.UrlTemplateImageryProvider({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maximumLevel: 18,
          })
        )
      } catch {}

      MINE_DATA.forEach((zone) => {
        const color = Cesium.Color.fromCssColorString(getCategoryColor(zone.category))

        const entity = viewer.entities.add({
          id: zone.id,
          name: zone.name,
          position: Cesium.Cartesian3.fromDegrees(zone.longitude, zone.latitude, 0),
          point: {
            pixelSize: 14,
            color,
            outlineColor: Cesium.Color.fromCssColorString('#050607'),
            outlineWidth: 3,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
          label: {
            text: zone.name,
            font: '13px Inter, system-ui, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#E8F0F2'),
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString('#0A0F12CC'),
            backgroundPadding: new Cesium.Cartesian2(8, 4),
            pixelOffset: new Cesium.Cartesian2(0, -30),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        })

        if (zone.category === 'priority_validation') {
          viewer.entities.add({
            id: `${zone.id}-ring`,
            position: Cesium.Cartesian3.fromDegrees(zone.longitude, zone.latitude, 0),
            ellipse: {
              semiMinorAxis: 18000,
              semiMajorAxis: 18000,
              material: new Cesium.ColorMaterialProperty(
                color.withAlpha(0.08)
              ),
              outline: true,
              outlineColor: color.withAlpha(0.25),
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
          })
        }
      })

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction((movement: any) => {
        const picked = viewer.scene.pick(movement.position)
        if (Cesium.defined(picked) && picked.id) {
          const mine = MINE_DATA.find(m => m.id === picked.id.id)
          if (mine) {
            const event = new CustomEvent('mine-selected', { detail: mine })
            window.dispatchEvent(event)
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    })

    return () => {
      mounted = false
      viewerRef.current?.destroy()
      viewerRef.current = null
    }
  }, [])

  return (
    <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-[28px] bg-[#080A0D]">
      <div ref={containerRef} className="cesium-container h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,6,7,0.5)_100%)]" />
      <div className="absolute bottom-4 left-4 flex gap-3">
        {[
          { color: '#E5C76B', label: 'Priority Validation' },
          { color: '#D99A3A', label: 'Investigate' },
          { color: '#3FAE7A', label: 'Monitor' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 rounded-full bg-[rgba(10,16,19,0.85)] px-3 py-1.5 backdrop-blur-[12px]">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8FA4B5]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { MINE_DATA }
export type { Hotspot }
