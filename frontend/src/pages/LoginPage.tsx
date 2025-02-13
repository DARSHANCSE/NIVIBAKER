import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://localhost:3000/user/login', { email, password }).then((res) => {
      if (res.data.success) {
        console.log('Login success:', res.data)
        navigate('/')
      }
      else {
        alert(`Login failed ${res.data.message}`)
        console.log('Login failed:', res.data)
      }
    }).catch((err) => {
      console.log(err)
    })
    console.log('Sign in:', { email, password })
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="bakery@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white">
        Sign In
      </Button>
      <p className="text-center text-sm text-[#4A3728]">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={()=>{
            window.location.href = '/register'
          }}
          className="text-[#D4AF37] hover:underline focus:outline-none"
        >
          Sign Up
        </button>
      </p>
    </form>
    </div>
    </div>
  )
}

