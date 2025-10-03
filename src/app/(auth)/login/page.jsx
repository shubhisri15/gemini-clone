'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { phoneSchema } from '@/schemas/phone-schema'
import CountryCodeDropdown from '@/components/CountryCodeDropdown'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '',
      phoneNumber: ''
    }
  })

  const onSubmit = (data) => {
    console.log("Form submitted:", data)
  }

  return (  
      <div className="w-full max-w-2xl p-8 bg-gray-800/90 rounded-2xl shadow-2xl flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-extrabold text-white text-center">Welcome Back!</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div className="flex gap-4 sm:flex-row">
            <div className="flex flex-col flex-1">
              <CountryCodeDropdown {...register('countryCode')} />
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
        </form>

        <p className="text-gray-300 text-sm mt-2 text-center">
          By continuing, you agree to our <span className="text-purple-400 underline cursor-pointer">Terms of Service</span> & <span className="text-purple-400 underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    
  )
}

export default LoginForm
