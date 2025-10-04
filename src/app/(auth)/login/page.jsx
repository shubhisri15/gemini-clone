// components/LoginForm.jsx (Updated)
'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { phoneSchema } from '@/schemas/phone-schema'
import CountryCodeDropdown from '@/components/CountryCodeDropdown'
import OTPForm from '@/components/OTPForm'
import { useAuthStore } from '@/stores/authStore' // New import
import { useRouter } from 'next/navigation' // New import

const LoginForm = () => {
  const router = useRouter()
  const getUserByPhone = useAuthStore((state) => state.getUserByPhone)
  const login = useAuthStore((state) => state.login)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: ''
    }
  })

  const [showOtp, setShowOtp] = useState(false)
  const [tempUserData, setTempUserData] = useState(null)


  const onSubmit = (data) => {
    const fullPhoneNumber = data.countryCode + data.phoneNumber
    const user = getUserByPhone(fullPhoneNumber)

    if (user) {
      // User found: Proceed with OTP login
      setTempUserData(user)
      console.log("User found. Simulating OTP send for login...")
      // You would show a toast notification here [cite: 36]
      setShowOtp(true)
    } else {
      // User not found: Redirect to Signup 
      console.log("User not found. Redirecting to signup.")
      // You would show a toast notification or error here [cite: 36]
      router.push('/sign-up') 
    }
  }

  // This function is called from the OTPForm component upon successful validation
  const onOtpSuccess = () => {
      // 3. Complete login and redirect [cite: 4]
      login(tempUserData)
      // Show success toast [cite: 36]
      setTimeout(() => {
        router.push('/dashboard')
      }, 5000)
       // Redirect to the dashboard
  }

  if (showOtp) {
    return (
      <OTPForm 
        size={6} 
        onSuccess={onOtpSuccess} 
      />
    )
  }

  return (
    <div className="w-2xl p-8 bg-gray-800/90 rounded-2xl shadow-2xl flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-extrabold text-white text-center">Welcome Back!</h1>

      {showOtp ? <OTPForm size={6}/> : 
      (<form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
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
            Send OTP
        </button>
        </form>)}

      {/* Optional: Add a link to signup */}
      <p className="text-gray-300 text-sm mt-2 text-center">
        Don't have an account? <span className="text-purple-400 underline cursor-pointer" onClick={() => router.push('/sign-up')}>Sign Up here</span>
      </p>
      <p className="text-gray-300 text-sm mt-2 text-center mt-4">
        By continuing, you agree to our <span className="text-purple-400 underline cursor-pointer">Terms of Service</span> & <span className="text-purple-400 underline cursor-pointer">Privacy Policy</span>
     </p>
    </div>
  )
}

export default LoginForm