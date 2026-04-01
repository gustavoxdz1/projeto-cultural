import { z } from 'zod';

export function requiredText(fieldLabel: string, minLength = 1) {
  return z
    .string()
    .trim()
    .min(minLength, `${fieldLabel} deve ter pelo menos ${minLength} caracteres.`);
}

export const emailField = z.string().trim().email('Informe um e-mail válido.');

export const passwordField = z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.');

export const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional();

export function optionalUrl(fieldLabel: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === '' || URL.canParse(value), {
      message: `${fieldLabel} inválida.`,
    })
    .optional();
}
