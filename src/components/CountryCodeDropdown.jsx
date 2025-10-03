import useCountriesInfo from '@/hooks/useCountriesInfo'
import React from 'react'

const CountryCodeDropdown = () => {
    const { data, loading, error } = useCountriesInfo()

    const renderOptions = data.map(country => <option key={country.id} value={country.dialCode}>{`[${country.dialCode}] - ${country.name}`}</option>)

    return (
        <select className='bg-white text-purple-900 px-4 font-bold rounded-md w-80'>
            {renderOptions}
        </select>
    )
}

export default CountryCodeDropdown