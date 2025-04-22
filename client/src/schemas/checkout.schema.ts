// src/schemas/checkout.schema.ts
import { z } from 'zod';

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid postal code format'),
  instructions: z.string().optional(),
});

// Card details validation schema
export const cardDetailsSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^[\d\s]{16,19}$/, 'Card number must be 16-19 digits'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .regex(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
});


// Full checkout form schema
export const checkoutFormSchema = z.object({
  address: addressSchema,
  payment:  z.enum(['cash', 'card']),
  specialInstructions: z.string().optional(),
});

// Export types
export type AddressFormValues = z.infer<typeof addressSchema>;
export type CardDetailsFormValues = z.infer<typeof cardDetailsSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
