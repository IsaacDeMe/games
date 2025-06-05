// src/pages/ResetPassword.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'



export default function ResetPassword() {
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (pass1 !== pass2) {
      setMessage('Las contraseñas no coinciden 😓')
      setError(true)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: pass1 })

    if (error) {
      setMessage('Error: ' + error.message)
      setError(true)
    } else {
      setMessage('¡Contraseña cambiada con éxito! 🎉')
      setError(false)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f2f2f2' }}>
      <nav style={{ background: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <strong>Isaac Delfa</strong> — Cambiar contraseña
      </nav>

      <div style={{
        maxWidth: '400px',
        margin: '60px auto',
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Introduce tu nueva contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={pass1}
            onChange={(e) => setPass1(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0' }}
          />
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            required
            style={{