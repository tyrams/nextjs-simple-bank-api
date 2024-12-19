import { z } from 'zod';

export const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
});

export const bankAccountSchema = z.object({
  accountName: z.string().min(1, 'Account name is required'),
  balance: z.number().min(0, 'Balance cannot be negative'),
});

export const customerUpdateSchema = customerSchema.partial();
export const bankAccountUpdateSchema = bankAccountSchema.partial();