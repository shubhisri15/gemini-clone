// schemas/signup-schema.js
import { z } from 'zod'
import { phoneSchema } from './phone-schema' // Assuming this already exists for phone/countryCode

export const signupSchema = phoneSchema.extend({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Must be a valid email address'),
})