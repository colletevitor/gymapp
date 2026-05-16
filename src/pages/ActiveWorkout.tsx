import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Check, Plus, Trash2, X, CheckCircle } from 'lucide-react'

function Stopwatch({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = new Date(startTime).getTime()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  const parts = h > 0
    ? [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
    : [m, s].map(v => String(v).padStart(2, '0')).join(':')

  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
      {parts}
    </span>
  )
}

export default function ActiveWorkout() {
  const navigate = useNavigate()
  const { activeSession, exercises, updateActiveSession, finishSession, cancelSession } = useStore()
  const [notes, setNotes] = useState('')
  const [showFinish, setShowFinish] = useState(false)

  if (!activeSession) {
    navigate('/')
    return null
  }

  const getExercise = (id: string) => exercises.find(e => e.id === id)

  const updateSet = (exIdx: number, setIdx: number, field: 'weight' | 'reps', value: number) => {
    const updated = { ...activeSession }
    updated.exercises = updated.exercises.map((ex, i) => {
      if (i !== exIdx) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, j) => j === setIdx ? { ...s, [field]: value } : s)
      }
    })
    updateActiveSession(updated)
  }

  const toggleSetDone = (exIdx: number, setIdx: number) => {
    const updated = { ...activeSession }
    updated.exercises = updated.exercises.map((ex, i) => {
      if (i !== exIdx) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, j) => j === setIdx ? { ...s, done: !s.done } : s)
      }
    })
    updateActiveSession(updated)
  }

  const addSet = (exIdx: number) => {
    const updated = { ...activeSession }
    const ex = updated.exercises[exIdx]
    const lastSet = ex.sets[ex.sets.length - 1]
    updated.exercises = updated.exercises.map((e, i) => {
      if (i !== exIdx) return e
      return {
        ...e,
        sets: [...e.sets, {
          id: Math.random().toString(36).slice(2),
          weight: lastSet?.weight || 0,
          reps: lastSet?.reps || 10,
          done: false,
        }]
      }
    })
    updateActiveSession(updated)
  }

  const removeSet = (exIdx: number, setIdx: number) => {
    const updated = { ...activeSession }
    updated.exercises = updated.exercises.map((ex, i) => {
      if (i !== exIdx) return ex
      return { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) }
    })
    updateActiveSession(updated)
  }

  const totalSets = activeSession.exercises.reduce((a, ex) => a + ex.sets.length, 0)
  const doneSets = activeSession.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.done).length, 0)
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0

  const handleFinish = () => {
    const start = new Date(activeSession.date).getTime()
    const duration = Math.round((Date.now() - start) / 60000)
    finishSession(Math.max(1, duration), notes)
    navigate('/')
  }

  return (
    <div className="app" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 2 }}>{activeSession.templateName}</p>
            <Stopwatch startTime={activeSession.date} />
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { if (confirm('Cancelar treino?')) { cancelSession(); navigate('/') } }}
            style={{ color: 'var(--red)', borderColor: '#ff444433' }}
          >
            <X size={14} /> Cancelar
          </button>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
          {doneSets}/{totalSets} séries concluídas
        </p>
      </div>

      {/* Exercises */}
      <div style={{ padding: '16px', paddingBottom: 40, overflowY: 'auto', flex: 1 }}>
        {activeSession.exercises.map((ex, exIdx) => {
          const exercise = getExercise(ex.exerciseId)
          const allDone = ex.sets.every(s => s.done) && ex.sets.length > 0
          return (
            <div key={exIdx} className="card" style={{ marginBottom: 12, borderColor: allDone ? 'var(--accent)' : 'var(--border)' }}>
              <div className="card-header">
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{exercise?.name || 'Exercício'}</p>
                  <span className="badge badge-accent" style={{ fontSize: 11, marginTop: 2 }}>
                    {exercise?.muscleGroup}
                  </span>
                </div>
                {allDone && <CheckCircle size={20} color="var(--accent)" />}
              </div>

              {/* Column headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 1fr 44px',
                gap: 8,
                padding: '4px 0',
                borderBottom: '1px solid var(--border)',
                marginBottom: 4,
              }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>#</span>
                <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>Kg</span>
                <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>Reps</span>
                <span style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>✓</span>
              </div>

              {ex.sets.map((set, setIdx) => (
                <div key={set.id} className="set-row" style={{ opacity: set.done ? 0.6 : 1 }}>
                  <span
                    className="set-num"
                    style={{ cursor: 'pointer', color: 'var(--text3)' }}
                    onClick={() => removeSet(exIdx, setIdx)}
                    title="Clique para remover"
                  >
                    {setIdx + 1}
                  </span>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={e => updateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                    style={{ textAlign: 'center', padding: '8px', fontSize: 15 }}
                    step="0.5"
                  />
                  <input
                    type="number"
                    value={set.reps}
                    onChange={e => updateSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                    style={{ textAlign: 'center', padding: '8px', fontSize: 15 }}
                  />
                  <button
                    className={`set-done ${set.done ? 'checked' : ''}`}
                    onClick={() => toggleSetDone(exIdx, setIdx)}
                  >
                    <Check size={16} />
                  </button>
                </div>
              ))}

              <button
                className="btn btn-ghost btn-sm btn-full"
                style={{ marginTop: 10, borderStyle: 'dashed' }}
                onClick={() => addSet(exIdx)}
              >
                <Plus size={14} /> Série
              </button>
            </div>
          )
        })}

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 8, marginBottom: 16, padding: '16px', fontSize: 16 }}
          onClick={() => setShowFinish(true)}
        >
          <Check size={18} /> Finalizar Treino
        </button>
      </div>

      {/* Finish modal */}
      {showFinish && (
        <div className="modal-overlay" onClick={() => setShowFinish(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              Finalizar treino
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
              {doneSets}/{totalSets} séries concluídas
            </p>
            <div className="form-group">
              <label className="form-label">Observações (opcional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Como foi o treino? Algo pra lembrar?"
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>
            <button className="btn btn-primary btn-full" style={{ marginBottom: 10 }} onClick={handleFinish}>
              <Check size={16} /> Salvar treino
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setShowFinish(false)}>
              Continuar treinando
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
