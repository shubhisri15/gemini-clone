'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { phoneSchema } from '@/schemas/phone-schema'
import CountryCodeDropdown from '@/components/CountryCodeDropdown'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(phoneSchema),  // <-- attach resolver here
    defaultValues: {
      countryCode: '',
      phoneNumber: ''
    }
  })

  const onSubmit = (data) => {
    console.log("Form submitted:", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full items-center">
      <h1 className='text-3xl font-extrabold mb-4'>Welcome Back!</h1>
      <div className='flex gap-4'>
        <CountryCodeDropdown {...register('countryCode')} />
        {errors.countryCode && <p className="text-red-500 text-sm">{errors.countryCode.message}</p>}
      
        <input
          type="tel"
          placeholder="Enter your phone number"
          {...register('phoneNumber')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-900"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
      </div>
      <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform cursor-pointer">
        Send OTP
      </button>
    </form>
  )
}

export default LoginForm
