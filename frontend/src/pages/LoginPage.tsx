import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';
import { GOOGLE_CLIENT_ID } from '@/config';

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginPage({ setIsAuthenticated }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
  
        const googleSignInButton = document.getElementById('googleSignIn');
        if (googleSignInButton) {
          window.google.accounts.id.renderButton(googleSignInButton, {
            type: 'standard',  
            theme: 'filled_black',  
            size: 'large',  
            text: 'signin_with',  
            shape: 'circle', 
          });
        }
      } else {
        console.error("Google API failed to load.");
      }
    };
  
    document.body.appendChild(script);
  }, []);
  // console.log(jwtDecode("eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2M2Y3YzRjZDI2YTFlYjJiMWIzOWE4OGY0NDM0ZDFmNGQ5YTM2OGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MzYxMDY3NTY5NDktbXNiaXJpbHVyM2Q5ZnQ1MGNiZm1uODdlaTgzZWVlZGkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MzYxMDY3NTY5NDktbXNiaXJpbHVyM2Q5ZnQ1MGNiZm1uODdlaTgzZWVlZGkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM4MTg5NDI4MjY3MTMxNzA1NDkiLCJlbWFpbCI6ImRhcnNoYW5zcmlkaGFyYmFidTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NDA4MDc4ODQsIm5hbWUiOiJEYXJzaGFuIFNyaWRoYXJCYWJ1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0kwLVJtb3lQYkZ1SF81Mkp3cGgyNkxaUGRubjFfU1ZsLWFwbTVZLTZhVU93M3dNNFE9czk2LWMiLCJnaXZlbl9uYW1lIjoiRGFyc2hhbiIsImZhbWlseV9uYW1lIjoiU3JpZGhhckJhYnUiLCJpYXQiOjE3NDA4MDgxODQsImV4cCI6MTc0MDgxMTc4NCwianRpIjoiMDI1NTQ4NmJiMWEzMTg4OTc1Y2ZiNjlmZTEwYWNjMTIyNmNiZWZmNCJ9.FLH7i5n_a33ChZsKEigFQ10403S4FIwtNoy-YDIYEeSsvGGIuFnXTx2Xyy01WD_FOp2wGz2JWq_gHp-tfLVmrEe7TGpgpkd3YQDcB9Zj6-iLv4F2wnzdijrIIUTbkuoynFAHNxHqspscfIxDHmX3vtn80y9keRp1skisSZJrl-BwBi2iMOmE-4HrQVUFS_4K9p6YfbpUomnoj53NzPTvcTL3gscQxln99ba_-ux7ea8KA-zahcpHkZ9S_T_7ui7CEWejrF5FSkSGwivy9CV4xJAX1geUWi_jpCo5AQf7dMrzfGSjyXPPIG9i5R2GLX_1ut_53oLeAGtWYur0DwAdFw"));

  const handleGoogleResponse = (response: any) => {
    console.log('Google Response:', jwtDecode(response.credential));
    axios.post('http://localhost:3000/user/googlelogin', { token: response.credential })
      .then(res => {
        if (res.data.success) {
          console.log('Google Login success:', res.data);
          setMessage('Login successful! Redirecting...');
          setIsAuthenticated(true);
          localStorage.setItem('token', res.data.token);
          console.log(  res.data.token);
          const decoded = jwtDecode(res.data.token);
          localStorage.setItem('user', JSON.stringify(decoded));
          navigate('/')
        } else {
          setMessage(res.data.message || 'Login failed. Please try again.');
          console.log('Google Login failed:', res.data);
        }
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'Something went wrong.');
        console.log(err);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:3000/user/login', { email, password })
      .then(res => {
        if (res.data.success) {
          console.log('Login success:', res.data);
          setMessage('Login successful! Redirecting...');
          setIsAuthenticated(true);
          localStorage.setItem('token', res.data.Token);
          const decoded = jwtDecode(res.data.Token);
          localStorage.setItem('user', JSON.stringify(decoded));
          setTimeout(() => navigate('/home'), 1000);
        } else {
          setMessage(res.data.message || 'Login failed. Please try again.');
          console.log('Login failed:', res.data);
        }
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'Something went wrong.');
        console.log(err);
      });
  };

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
          {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
          <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white">
            Sign In
          </Button>
          <div className="text-center mt-4">
            <div id="googleSignIn" className="flex justify-center"></div>
          </div>
          <p className="text-center text-sm text-[#4A3728]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => { window.location.href = '/register'; }}
              className="text-[#D4AF37] hover:underline focus:outline-none"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
