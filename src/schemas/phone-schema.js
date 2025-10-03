import { z } from 'zod'

export const phoneSchema = z.object({
  countryCode: z.string().nonempty("Select a country code"),
  phoneNumber: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\d{6,15}$/, "Enter a valid phone number") 
})
