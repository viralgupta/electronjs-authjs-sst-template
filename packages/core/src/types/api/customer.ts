import { z } from 'zod';

export const createCustomerSchema  = z.object({
  name: z.string().min(2, 'Name too short'),
  // balance: z.string()('Balance must be greater than equal to 0'),
  country_code: z.number().min(1, 'Country code too short').optional(),
  phone_no: z.number().min(10, 'Phone number too short'),
  whatsappChatId: z.string().optional() 
}).strict("Too many fields in request body");

