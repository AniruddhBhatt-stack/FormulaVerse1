import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthSuccess(){
  const navigate = useNavigate()

  useEffect(() => {
    // Capture token from URL and save to localStorage
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if(token){
      localStorage.setItem('mathnarrator_token', token)
      // Optionally, remove token from URL
      window.history.replaceState({}, document.title, "/auth/success")
      // Redirect to chat
      navigate('/chat')
    } else {
      // no token, back to home
      navigate('/')
    }
  }, [navigate])

  return <div>Logging in…</div>
}
