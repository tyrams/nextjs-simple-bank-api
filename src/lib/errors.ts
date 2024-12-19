export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'PARTIAL_UPDATE_ERROR'
  | 'DATABASE_ERROR';

export interface AppError extends Error {
  statusCode: number;
  type: ErrorType;
  details?: unknown;
}

export function createError(
  message: string,
  statusCode: number,
  type: ErrorType,
  details?: unknown
): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.type = type;
  if (details) error.details = details;
  return error;
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'statusCode' in error && 'type' in error;
}

export const Errors = {
  CustomerNotFound: (id: string) => 
    createError(`Customer with ID ${id} not found`, 404, 'NOT_FOUND'),
  
  AccountNotFound: (customerId: string) =>
    createError(`Account for customer ID ${customerId} not found`, 404, 'NOT_FOUND'),
  
  ValidationError: (details: unknown) =>
    createError('Validation failed', 400, 'VALIDATION_ERROR', details),
  
  PartialUpdateError: (success: string[], failed: string[]) =>
    createError(
      'Operation partially succeeded',
      207,
      'PARTIAL_UPDATE_ERROR',
      { success, failed }
    ),
  
  DatabaseError: (operation: string) =>
    createError(`Database operation failed: ${operation}`, 500, 'DATABASE_ERROR')
};