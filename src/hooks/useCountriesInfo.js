'use client'
import React, { useEffect, useState } from 'react'

const useCountriesInfo = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        getCountryCodes()
        setLoading(false)
    }, [])

    const getCountryCodes = async () => {
        try {
            const countryCodeResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd')
            if (!countryCodeResponse.ok) {
                throw new Error('Failed to fetch country information. ')
            }
            const countryData = await countryCodeResponse.json()

            const formattedCountryData = countryData.map((country) => {
                const name = country?.name?.common || 'Unknown'
                const id = country?.cca2 || ''
                let dialCode = ''

                if (country?.idd?.root) {
                    const suffixes =
                    Array.isArray(country.idd.suffixes) && country.idd.suffixes.length > 0
                        ? country.idd.suffixes
                        : ['']
                    dialCode = `${country.idd.root}${suffixes[0]}`
                }

                return { id, name, dialCode }
            }).filter(country => country.id).sort((a, b) => a.name.localeCompare(b.name))

            setData(formattedCountryData)

        } catch (error) {
            console.error(err)
            setError(err.message || 'Something went wrong')
        }
        
    } 

    return { data, loading, error }
}

export default useCountriesInfo