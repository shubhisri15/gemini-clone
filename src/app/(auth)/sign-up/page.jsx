// components/SignupForm.jsx
'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/schemas/signup-schema'
import CountryCodeDropdown from '@/components/CountryCodeDropdown'
import OTPForm from '@/components/OTPForm'
import { useAuthStore } from '@/stores/authStore' // Import the store
import { useRouter } from 'next/navigation' // Use for redirection after OTP

const SignupForm = () => {
  const router = useRouter()
  const registerUser = useAuthStore((state) => state.registerUser)
  const login = useAuthStore((state) => state.login)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: '',
      fullName: '',
      email: '',
    },
  })

  const [showOtp, setShowOtp] = useState(false)
  const [userData, setUserData] = useState(null)

  const onSendOtp = (data) => {
    setUserData(data)
    
    // 1. Register the user in the store
    registerUser(data) 
    
    // 2. Simulate OTP send [cite: 11]
    console.log("Simulating OTP sent for signup:", data)
    // You would typically show a toast notification here [cite: 36]
    
    setShowOtp(true)
  }

  // This function is called from the OTPForm component upon successful validation
  const onOtpSuccess = () => {
      // 3. Complete login and redirect [cite: 4]
      login(userData)
      // Show success toast [cite: 36]
      router.push('/dashboard') // Redirect to the dashboard
  }

  if (showOtp) {
    return (
        <OTPForm 
          size={6} 
          onSuccess={onOtpSuccess}
          phoneNumber={userData.phoneNumber}
        />
    )
  }

  return (
    <div className="w-2xl p-8 bg-gray-800/90 rounded-2xl shadow-2xl flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-extrabold text-white text-center">Create Your Account</h1>

      <form onSubmit={handleSubmit(onSendOtp)} className="w-full flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Full Name"
            {...register('fullName')}
            className="w-full px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-gray-900 placeholder-gray-400"
          />
          {errors.fullName && <span className="text-red-400 text-sm mt-1">{errors.fullName.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email Address"
            {...register('email')}
            className="w-full px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-gray-900 placeholder-gray-400"
          />
          {errors.email && <span className="text-red-400 text-sm mt-1">{errors.email.message}</span>}
        </div>
        
        {/* Phone Number & Country Code */}
        <div className="flex gap-4 sm:flex-row">
          <div className="flex flex-col flex-1">
            <CountryCodeDropdown register={register} error={errors.countryCode} />
            {errors.countryCode && <span className="text-red-400 text-sm mt-1">{errors.countryCode.message}</span>}
          </div>

          <div className="flex flex-col flex-2">
            <input
              type="tel"
              placeholder="Phone number"
              {...register('phoneNumber')}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-gray-900 placeholder-gray-400"
            />
            {errors.phoneNumber && <span className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</span>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          Send OTP & Sign Up
        </button>
      </form>

      {/* ... bottom text */}
    </div>
  )
}

export default SignupForm