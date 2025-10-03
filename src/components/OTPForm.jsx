import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'

const OTPForm = ({ size }) => {
  const [otp, setOtp] = useState(Array.from({ length: size }, () => ''))
  const [verifying, setVerifying] = useState(false)
  const inputsRef = useRef([])
  const router = useRouter()

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < size - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
      inputsRef.current[index - 1]?.focus()
    }
  }

  const verifyOtp = (e) => {
    e.preventDefault()
    setVerifying(true)

    setTimeout(() => {
      router.push('/dashboard')
      setVerifying(false)
    }, 3000)  
  }

  const otpInputs = otp.map((_, i) => (
    <input
      key={i}
      type="text"
      className="bg-white w-10 h-10 p-2 font-bold text-xl text-gray-800 focus:ring-2 focus:ring-purple-400 text-center rounded"
      inputMode="numeric"
      maxLength={1}
      ref={(el) => (inputsRef.current[i] = el)}
      value={otp[i]}
      onChange={(e) => handleChange(e.target.value, i)}
      onKeyDown={(e) => handleKeyDown(e, i)}
    />
  ))

  return verifying ? (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={verifyOtp}
      className="flex flex-col gap-4 w-full items-center"
    >
      <div className="flex gap-4">{otpInputs}</div>
      <button
        type="submit"
        className="w-3/5 mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        Verify OTP
      </button>
    </form>
  )
}

export default OTPForm
