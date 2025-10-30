import { z } from 'zod';

// Auth schema
export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').optional()
});

// Media schema
export const mediaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['MOVIE', 'TV_SHOW']),
  director: z.string().min(1, 'Director is required'),
  budget: z.string().min(1, 'Budget is required'),
  location: z.string().min(1, 'Location is required'),
  duration: z.string().min(1, 'Duration is required'),
  year: z.string().min(1, 'Year/Time is required'),
  imageUrl: z.string().url().optional().or(z.literal(''))
});

export const validateAuth = (req, res, next) => {
  try {
    // For login, name is not required
    if (req.path === '/login') {
      const loginSchema = authSchema.omit({ name: true });
      loginSchema.parse(req.body);
    } else {
      authSchema.parse(req.body);
    }
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
};

export const validateMedia = (req, res, next) => {
  try {
    mediaSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }
};