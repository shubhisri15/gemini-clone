'use client'

import useCountriesInfo from '@/hooks/useCountriesInfo'
import { register } from 'next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup'
import React from 'react'

const CountryCodeDropdown = ({ register, error: countryCodeError}) => {
  const { data, loading, error } = useCountriesInfo()

  const renderOptions = data.map((country) => (
    <option key={country.id} value={country.dialCode}>
      {`${country.name} - [${country.dialCode}]`}
    </option>
  ))

  return (
    <div className="relative w-full">
      <select
        {...register('countryCode')}
        className="
          w-full
          h-12
          px-4
          pr-12
          text-purple-900
          font-semibold
          rounded-xl
          border
          border-gray-300
          bg-white
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-purple-400
          hover:border-purple-400
          transition
          duration-200
          ease-in-out
          cursor-pointer
          appearance-none
        "  
      >
        <option value="">Select country code</option>
        {loading && <option>Loading...</option>}
        {(error || countryCodeError) && <option>Error loading countries</option>}
        {!loading && !(error || countryCodeError) && renderOptions}
      </select>

      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-900 font-bold text-lg">
        ▼
      </span>
    </div>
  )
}

export default CountryCodeDropdown
