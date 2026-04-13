import { z } from 'zod';

// Registro de usuario (todos los campos requeridos)
export const registerUserSchema = z.object({
  body: z.object({
    email: z.string().email().transform((v) => v.trim().toLowerCase()),
    password: z.string().min(8),
    name: z.string().min(1).transform((v) => v.trim()),
    lastName: z.string().min(1).transform((v) => v.trim()),
    nif: z.string().min(1).transform((v) => v.trim())
  })
});

// Validación de email
export const validateEmailSchema = z.object({
  body: z.object({
    code: z.string().length(6).regex(/^\d{6}$/)
  })
});

// Login
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email().transform((v) => v.trim().toLowerCase()),
    password: z.string().min(8)
  })
});

// Onboarding datos personales
export const onboardingPersonalSchema = z.object({
  body: z.object({
    name: z.string().min(1).transform((v) => v.trim()),
    lastName: z.string().min(1).transform((v) => v.trim()),
    nif: z.string().min(1).transform((v) => v.trim())
  })
});

// Onboarding datos compañía
export const onboardingCompanySchema = z.object({
  body: z.object({
    name: z.string().min(1).transform((v) => v.trim()),
    cif: z.string().min(1).transform((v) => v.trim()),
    address: z.object({
      street: z.string().min(1).transform((v) => v.trim()),
      number: z.string().min(1).transform((v) => v.trim()),
      postal: z.string().min(1).transform((v) => v.trim()),
      city: z.string().min(1).transform((v) => v.trim()),
      province: z.string().min(1).transform((v) => v.trim())
    }),
    isFreelance: z.boolean()
  })
});

// Logo de la compañía
export const logoSchema = z.object({
  // Multer validation is handled in middleware, not here
});

// Cambiar contraseña
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8)
  }).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword']
  })
});

// Invitar compañeros
export const inviteUserSchema = z.object({
  body: z.object({
    email: z.string().email().transform((v) => v.trim().toLowerCase()),
    name: z.string().min(1).transform((v) => v.trim()),
    lastName: z.string().min(1).transform((v) => v.trim()),
    nif: z.string().min(1).transform((v) => v.trim())
  })
});
