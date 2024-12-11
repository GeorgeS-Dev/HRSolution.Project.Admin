import { throwError } from 'rxjs';
import { ApiResponse, ApiError } from '../services/api-response.js';
import { IdentityExceptionMessages } from '../services/identity/identityexceptioncodetypes.js';
import { HttpErrorResponse } from '@angular/common/http';

export function parseIdentityResponse<T>(response: ApiResponse<T>): T {
  if (response.succeeded) {
    if (response.data) {
      return response.data;
    }
    throw new Error('Response succeeded but no data was provided.');
  }

  throw new Error('An unknown error occurred.');
}

export function parseIdentityResponseError(response: ApiResponse<null>): ApiError {
  const apiError: ApiError = {
    message: null,
    validation: null,
  };

  if (response && response.errorCode) {
    apiError.message = `${IdentityExceptionMessages[response.errorCode] || 'Unknown error'}`;
    return apiError;
  }

  if (response && response.message) {
    try {
      const validationErrors = JSON.parse(response.message);

      if (Array.isArray(validationErrors)) {
        apiError.validation = validationErrors.join(', ');
        return apiError;
      }
    } catch (e) {
      apiError.message = response.message || 'An unknown error occurred.';
      return apiError;
    }
  }

  apiError.message = 'An unknown error occurred.';
  return apiError;
}
