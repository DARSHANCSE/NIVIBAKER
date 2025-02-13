import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'details' | 'otp' | 'password'>('details')
  const navigate=useNavigate()
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://localhost:3000/user/Sendotp', { email }).then((res) => {
      if (res.data.success){setOtp(res.data.otp)
      console.log('Sending OTP to:', email)
      setStep('otp')}
    }).catch((err) => {
        console.log(err)
      })

    
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
   axios.post('http://localhost:3000/user/verifyotp', { email,otp }).then((res) => {
  
    console.log('Verifying OTP:', otp)
    if (res.data.verified==true){
    setStep('password')}
    else{
      console.log('OTP is not verified')
    }
  }).catch((err) => {
    console.log(err)
  })
    
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    axios.post('http://localhost:3000/user/reg', { name, email, password }).then((res) => {
       
      if (res.data.success){  
        navigate("/login")
      }
    })
    console.log('Sign up:', { name, email, password })
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
<form onSubmit={handleSubmit} className="space-y-4">
      {step === 'details' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <Button type="button" onClick={handleSendOtp} className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white">
            Send OTP
          </Button>
        </>
      )}

      {step === 'otp' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="button" onClick={handleVerifyOtp} className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white">
            Verify OTP
          </Button>
        </>
      )}

      {step === 'password' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">Set Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white">
            Complete Sign Up
          </Button>
        </>
      )}

      <p className="text-center text-sm text-[#4A3728]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={()=>{
            window.location.href = '/login'
          }}
          className="text-[#D4AF37] hover:underline focus:outline-none"
        >
          Sign In
        </button>
      </p>
    </form>
    </div>
    </div>
  )
}

