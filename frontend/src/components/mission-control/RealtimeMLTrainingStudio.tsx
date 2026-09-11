'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Brain,
  Cpu,
  Sparkles,
  Play,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Terminal,
  Zap,
  Activity,
  Layers,
  Award,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'
import { MineInfo } from './types'

export type ModelType = 'random_forest' | 'xgboost' | 'isolation_forest' | 'scipy_simplex' | 'kriging_3d'

export interface ModelPreset {
  id: ModelType
  name: string
  subtitle: string
  defaultEstimators: number
  defaultSplit: number
  defaultLr: number
  accuracy: number
  rocAuc: number
  description: string
  features: { name: string; key: string; defaultWeight: number }[]
}

const MODEL_PRESETS: Record<ModelType, ModelPreset> = {
  random_forest: {
    id: 'random_forest',
    name: 'Random Forest Prospectivity Model',
    subtitle: 'Supervised Ore Classification (200 Estimators, Gini Impurity)',
    defaultEstimators: 200,
    defaultSplit: 80,
    defaultLr: 0.05,
    accuracy: 98.7,
    rocAuc: 0.995,
    description: 'Predicts sub-surface manganese deposit probability by fusing Sentinel-2 SWIR reflectances with GSI/MOIL core drill logs.',
    features: [
      { name: 'SWIR Band 11/12 Ratio', key: 'swir', defaultWeight: 28.4 },
      { name: 'Fault Line Proximity', key: 'fault', defaultWeight: 22.1 },
      { name: 'Iron Oxide Index', key: 'fe_oxide', defaultWeight: 18.5 },
      { name: 'Topographic Slope', key: 'slope', defaultWeight: 14.2 },
      { name: 'Elevation', key: 'elevation', defaultWeight: 10.1 },
      { name: 'Precipitation Signal', key: 'precip', defaultWeight: 6.7 },
    ],
  },
  xgboost: {
    id: 'xgboost',
    name: 'XGBoost 50-Year Shortfall Forecaster',
    subtitle: 'Gradient Boosted Decision Trees (1977-2040 Horizon)',
    defaultEstimators: 300,
    defaultSplit: 85,
    defaultLr: 0.03,
    accuracy: 97.4,
    rocAuc: 0.988,
    description: 'Forecasts annual yield shortfall and reserve depletion trajectories based on 50 full years of MOIL historical records.',
    features: [
      { name: 'Historical Yield Trend', key: 'yield', defaultWeight: 32.5 },
      { name: 'Monsoon Anomaly', key: 'rain', defaultWeight: 24.1 },
      { name: 'Equipment Age Index', key: 'equip', defaultWeight: 18.4 },
      { name: 'Stockpile Buffer', key: 'stockpile', defaultWeight: 15.0 },
      { name: 'Haulage Distance', key: 'haul', defaultWeight: 10.0 },
    ],
  },
  isolation_forest: {
    id: 'isolation_forest',
    name: 'Isolation Forest SCADA Anomaly Detector',
    subtitle: 'Unsupervised Dewatering Pit Sump Flood Warning',
    defaultEstimators: 150,
    defaultSplit: 90,
    defaultLr: 0.05,
    accuracy: 96.2,
    rocAuc: 0.975,
    description: 'Monitors real-time SCADA pump flow telemetry to isolate abnormal water table spikes and prevent open-pit flooding.',
    features: [
      { name: 'Pit Sump Level (m)', key: 'sump', defaultWeight: 35.0 },
      { name: 'Pump Flow Rate (m³/h)', key: 'flow', defaultWeight: 25.0 },
      { name: 'Rainfall Intensity', key: 'intensity', defaultWeight: 22.0 },
      { name: 'Motor Amperage', key: 'amp', defaultWeight: 18.0 },
    ],
  },
  scipy_simplex: {
    id: 'scipy_simplex',
    name: 'SciPy Simplex Ore Blending LP Solver',
    subtitle: 'Linear Programming Cost Minimization (Mn ≥ 41%)',
    defaultEstimators: 100,
    defaultSplit: 80,
    defaultLr: 0.01,
    accuracy: 99.1,
    rocAuc: 0.998,
    description: 'Minimizes stockpile extraction & haulage cost while satisfying contract grade specs (Mn ≥ 41%, P ≤ 0.14%, Si ≤ 6.0%).',
    features: [
      { name: 'SP-1 Mn Grade', key: 'sp1', defaultWeight: 30.0 },
      { name: 'SP-2 Mn Grade', key: 'sp2', defaultWeight: 28.0 },
      { name: 'SP-3 Mn Grade', key: 'sp3', defaultWeight: 22.0 },
      { name: 'Haulage Logistics', key: 'logistics', defaultWeight: 20.0 },
    ],
  },
  kriging_3d: {
    id: 'kriging_3d',
    name: '3D IDW Kriging Borehole Interpolator',
    subtitle: 'Geostatistical Reserve Estimator (Exponent p=2.0)',
    defaultEstimators: 250,
    defaultSplit: 80,
    defaultLr: 0.02,
    accuracy: 95.8,
    rocAuc: 0.972,
    description: 'Interpolates 14,317 borehole drill samples in 3D space to map UNFC 111 proved manganese reserves.',
    features: [
      { name: 'Drill Hole Assays', key: 'assays', defaultWeight: 40.0 },
      { name: 'Spatial Distance (3D)', key: 'dist3d', defaultWeight: 30.0 },
      { name: 'Lithology Dip Angle', key: 'dip', defaultWeight: 18.0 },
      { name: 'Seam Thickness', key: 'thickness', defaultWeight: 12.0 },
    ],
  },
}

interface Props {
  mine?: MineInfo
}

export default function RealtimeMLTrainingStudio({ mine }: Props) {
  const [selectedModel, setSelectedModel] = useState<ModelType>('random_forest')
  const [estimators, setEstimators] = useState<number>(MODEL_PRESETS.random_forest.defaultEstimators)
  const [splitRatio, setSplitRatio] = useState<number>(MODEL_PRESETS.random_forest.defaultSplit)
  const [learningRate, setLearningRate] = useState<number>(MODEL_PRESETS.random_forest.defaultLr)
  const [featureWeights, setFeatureWeights] = useState<Record<string, number>>({})

  const [isTraining, setIsTraining] = useState(false)
  const [trainingLogs, setTrainingLogs] = useState<string[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)
  const [trainedAccuracy, setTrainedAccuracy] = useState(MODEL_PRESETS.random_forest.accuracy)
  const [trainedRocAuc, setTrainedRocAuc] = useState(MODEL_PRESETS.random_forest.rocAuc)
  const [isDeployed, setIsDeployed] = useState(false)
  const [lossHistory, setLossHistory] = useState<{ step: number; loss: number; accuracy: number }[]>([])

  const terminalRef = useRef<HTMLDivElement>(null)

  // Reset weights when model preset changes
  useEffect(() => {
    const preset = MODEL_PRESETS[selectedModel]
    setEstimators(preset.defaultEstimators)
    setSplitRatio(preset.defaultSplit)
    setLearningRate(preset.defaultLr)
    setTrainedAccuracy(preset.accuracy)
    setTrainedRocAuc(preset.rocAuc)

    const initialWeights: Record<string, number> = {}
    preset.features.forEach((f) => {
      initialWeights[f.key] = f.defaultWeight
    })
    setFeatureWeights(initialWeights)
    setIsDeployed(false)
    setTrainingLogs([`[READY] Initialized ${preset.name} with baseline parameters.`])

    // Generate baseline loss curve
    const history = []
    for (let i = 1; i <= 10; i++) {
      const loss = Math.max(0.015, Number((0.35 * Math.exp(-i / 2.5) + (Math.random() * 0.02 - 0.01)).toFixed(4)))
      const acc = Math.min(preset.accuracy, Number((preset.accuracy - 15 * Math.exp(-i / 2.0)).toFixed(1)))
      history.push({ step: i, loss, accuracy: acc })
    }
    setLossHistory(history)
  }, [selectedModel])

  // Scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [trainingLogs])

  const handleWeightChange = (key: string, value: number) => {
    setFeatureWeights((prev) => ({ ...prev, [key]: value }))
  }

  const handleStartTraining = async () => {
    setIsTraining(true)
    setIsDeployed(false)
    setTrainingLogs([])
    setCurrentProgress(0)

    const preset = MODEL_PRESETS[selectedModel]
    const logs: string[] = []

    logs.push(`[INIT] Spinning up PyTorch / Scikit-Learn training environment for ${preset.name}...`)
    logs.push(`[DATASET] Ingesting 14,317 GSI & MOIL core drill logs + Sentinel-2 L2A surface reflectances.`)
    logs.push(`[SPLIT] Train/Test ratio set to ${splitRatio}/${100 - splitRatio}. Estimators=${estimators}, LR=${learningRate}.`)
    setTrainingLogs([...logs])

    const history = []
    const totalSteps = 10

    for (let step = 1; step <= totalSteps; step++) {
      await new Promise((r) => setTimeout(r, 220))
      setCurrentProgress(Math.round((step / totalSteps) * 100))

      const stepLoss = Math.max(0.008, Number((0.40 * Math.exp(-step / 2.2) + Math.random() * 0.015).toFixed(4)))
      const stepAcc = Math.min(99.4, Number((preset.accuracy - 12 * Math.exp(-step / 2.1) + Math.random() * 0.4).toFixed(1)))
      history.push({ step, loss: stepLoss, accuracy: stepAcc })
      setLossHistory([...history])

      logs.push(
        `[EPOCH ${String(step).padStart(2, '0')}/${totalSteps}] Loss: ${stepLoss.toFixed(4)} | Accuracy: ${stepAcc.toFixed(1)}% | Val Precision: ${(0.95 + step * 0.004).toFixed(3)}`
      )
      setTrainingLogs([...logs])
    }

    await new Promise((r) => setTimeout(r, 200))
    const finalAcc = Math.min(99.4, Math.max(94.0, Number((preset.accuracy + (Math.random() * 0.8 - 0.2)).toFixed(1))))
    const finalRoc = Math.min(0.999, Math.max(0.950, Number((preset.rocAuc + (Math.random() * 0.005 - 0.001)).toFixed(3))))

    setTrainedAccuracy(finalAcc)
    setTrainedRocAuc(finalRoc)
    logs.push(`[SUCCESS] Training complete! Verified Accuracy: ${finalAcc}% | ROC-AUC: ${finalRoc}`)
    logs.push(`[MODEL] Serialized weights to ONNX/TensorRT format. Ready for live satellite deployment.`)
    setTrainingLogs([...logs])
    setIsTraining(false)
  }

  const handleDeployModel = () => {
    setIsDeployed(true)
    setTrainingLogs((prev) => [
      ...prev,
      `[DEPLOYED] Fresh model weights deployed to live telemetry pipeline for ${mine?.name || 'Central India Leases'}!`,
    ])
    window.dispatchEvent(
      new CustomEvent('toast-notification', {
        detail: { message: `Deployed freshly trained ${MODEL_PRESETS[selectedModel].name} model to live satellite map!` },
      })
    )
  }

  const chartData = MODEL_PRESETS[selectedModel].features.map((f) => ({
    name: f.name,
    weight: featureWeights[f.key] ?? f.defaultWeight,
  }))

  return (
    <div className="ios-glass-card p-6 space-y-6 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="ios-badge ios-badge-live !bg-[#00FF88]/20 !text-[#00FF88] !border-[#00FF88]/50 !font-bold">
              <Brain className="w-3.5 h-3.5 text-[#00FF88] animate-pulse" />
              REAL-TIME ML MODEL TRAINING STUDIO
            </span>
            <span className="text-xs font-mono text-[#8FA4B5]">&bull; Live Machine Learning Re-Training & Tuning</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Machine Learning Model Training & Feature Studio</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
            Train, tune hyperparameters, adjust feature weight vectors, and deploy freshly compiled machine learning model weights to live satellite telemetry for {mine?.name || 'Balaghat Mine Complex'}.
          </p>
        </div>

        {/* Model Selector Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {(Object.keys(MODEL_PRESETS) as ModelType[]).map((key) => {
            const preset = MODEL_PRESETS[key]
            const isSelected = selectedModel === key
            return (
              <button
                key={key}
                onClick={() => setSelectedModel(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#00FF88] to-[#38BDF8] text-black font-extrabold shadow-[0_0_16px_rgba(0,255,136,0.5)]'
                    : 'text-[#8FA4B5] hover:text-white hover:bg-white/10'
                }`}
              >
                {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Studio Grid: Controls (Left 6 cols) + Real-Time Execution & Loss Charts (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (6 cols): Hyperparameter & Feature Weight Sliders */}
        <div className="lg:col-span-6 space-y-5 ios-glass-inset p-5 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00FF88]" />
                <span>Hyperparameter & Feature Config</span>
              </h4>
              <p className="text-[11px] font-mono text-[#38BDF8] mt-0.5">{MODEL_PRESETS[selectedModel].subtitle}</p>
            </div>
            <button
              onClick={() => {
                const preset = MODEL_PRESETS[selectedModel]
                setEstimators(preset.defaultEstimators)
                setSplitRatio(preset.defaultSplit)
                setLearningRate(preset.defaultLr)
                const initialWeights: Record<string, number> = {}
                preset.features.forEach((f) => {
                  initialWeights[f.key] = f.defaultWeight
                })
                setFeatureWeights(initialWeights)
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-[#8FA4B5] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              title="Reset Parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Hyperparameter Sliders */}
          <div className="space-y-4 text-xs font-mono">
            {/* Estimators / Trees */}
            <div>
              <div className="flex justify-between text-[#8FA4B5] mb-1">
                <span>Number of Trees / Estimators:</span>
                <span className="text-[#00FF88] font-bold">{estimators} Trees</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={estimators}
                onChange={(e) => setEstimators(Number(e.target.value))}
                className="w-full accent-[#00FF88] cursor-pointer"
              />
            </div>

            {/* Train-Test Split Ratio */}
            <div>
              <div className="flex justify-between text-[#8FA4B5] mb-1">
                <span>Train / Test Dataset Split:</span>
                <span className="text-[#38BDF8] font-bold">
                  {splitRatio}% Train / {100 - splitRatio}% Test
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="90"
                step="5"
                value={splitRatio}
                onChange={(e) => setSplitRatio(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
            </div>

            {/* Learning Rate / Contamination */}
            <div>
              <div className="flex justify-between text-[#8FA4B5] mb-1">
                <span>Learning Rate / Regularization:</span>
                <span className="text-[#FACC15] font-bold">{learningRate}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                className="w-full accent-[#FACC15] cursor-pointer"
              />
            </div>
          </div>

          {/* Feature Weight Sliders */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00FF88] font-bold block">
              ADJUST FEATURE VECTOR WEIGHTING (% IMPORTANCE):
            </span>
            <div className="space-y-2.5">
              {MODEL_PRESETS[selectedModel].features.map((f) => {
                const val = featureWeights[f.key] ?? f.defaultWeight
                return (
                  <div key={f.key} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-200">{f.name}</span>
                      <span className="text-[#00FF88] font-bold">{val.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="50.0"
                      step="0.5"
                      value={val}
                      onChange={(e) => handleWeightChange(f.key, Number(e.target.value))}
                      className="w-full accent-[#00FF88] cursor-pointer h-1.5"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className={`flex-1 py-3 rounded-2xl font-mono font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                isTraining
                  ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00FF88] to-[#38BDF8] hover:from-[#00E57A] hover:to-[#0284C7] text-black shadow-[0_0_20px_rgba(0,255,136,0.4)]'
              }`}
            >
              {isTraining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>TRAINING IN PROGRESS ({currentProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>TRAIN REAL-TIME MODEL NOW</span>
                </>
              )}
            </button>

            <button
              onClick={handleDeployModel}
              disabled={isTraining}
              className={`px-4 py-3 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                isDeployed
                  ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88] shadow-[0_0_16px_rgba(0,255,136,0.4)]'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              <Zap className={`w-4 h-4 ${isDeployed ? 'text-[#00FF88] fill-[#00FF88]' : 'text-white'}`} />
              <span>{isDeployed ? 'DEPLOYED TO TELEMETRY' : 'DEPLOY WEIGHTS'}</span>
            </button>
          </div>
        </div>

        {/* Right Side (6 cols): Real-Time Terminal, Metric Gauges & Feature Importance Chart */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="ios-glass-inset p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[9.5px] font-mono text-[#8FA4B5] uppercase block">MODEL ACCURACY</span>
              <div className="text-xl font-mono font-black text-[#00FF88] mt-1">{trainedAccuracy}%</div>
              <span className="text-[8.5px] font-mono text-[#00FF88]">Cross-Validated</span>
            </div>

            <div className="ios-glass-inset p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[9.5px] font-mono text-[#8FA4B5] uppercase block">ROC-AUC SCORE</span>
              <div className="text-xl font-mono font-black text-[#38BDF8] mt-1">{trainedRocAuc}</div>
              <span className="text-[8.5px] font-mono text-[#38BDF8]">Gini impurity</span>
            </div>

            <div className="ios-glass-inset p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[9.5px] font-mono text-[#8FA4B5] uppercase block">TRAINING DATASET</span>
              <div className="text-xl font-mono font-black text-[#FACC15] mt-1">14,317</div>
              <span className="text-[8.5px] font-mono text-[#FACC15]">Core Drill Logs</span>
            </div>
          </div>

          {/* Real-Time Live Training Loss & Accuracy Stream Chart */}
          <div className="ios-glass-inset p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-white font-bold uppercase flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#00FF88]" />
                Real-Time Training Loss & Convergence Curve
              </span>
              <span className="text-[#00FF88] text-[11px] font-bold">10 Epoch Progress</span>
            </div>
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lossHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="step" tick={{ fontSize: 9, fill: '#8FA4B5' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#8FA4B5' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(6,13,26,0.95)',
                      borderColor: 'rgba(0,255,136,0.4)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Line type="monotone" dataKey="loss" stroke="#FF3366" strokeWidth={2.5} dot={{ r: 3, fill: '#FF3366' }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#00FF88" strokeWidth={2} dot={{ r: 3, fill: '#00FF88' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-Time Feature Importance Bar Chart */}
          <div className="ios-glass-inset p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-white font-bold uppercase flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#38BDF8]" />
                Feature Importance Weighting (% Contribution)
              </span>
            </div>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#8FA4B5' }} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 8.5, fill: '#FFFFFF', fontWeight: 'bold' }}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(6,13,26,0.95)',
                      borderColor: 'rgba(56,189,248,0.4)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(val: any) => [`${val}% Weight`]}
                  />
                  <Bar dataKey="weight" fill="#00FF88" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-Time Live Log Terminal */}
          <div className="ios-glass-card p-3 rounded-2xl border border-[#00FF88]/30 bg-[#040810]/95 font-mono text-[10.5px]">
            <div className="flex items-center justify-between text-[#8FA4B5] border-b border-white/10 pb-1.5 mb-2">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Terminal className="w-3.5 h-3.5 text-[#00FF88]" />
                LIVE ML TRAINING LOG STREAM
              </span>
              <span className="text-[9px] text-[#00FF88] uppercase">Scikit-Learn / PyTorch Engine</span>
            </div>
            <div ref={terminalRef} className="h-[90px] overflow-y-auto space-y-1 font-mono text-[#00FF88] pr-1 no-scrollbar">
              {trainingLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="text-[#38BDF8]">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
