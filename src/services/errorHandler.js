/**
 * Error Handling Service
 * Centralized error handling and user-friendly error messages
 */

class ErrorHandler {
  constructor() {
    this.errorMessages = {
      // Network errors
      NETWORK_ERROR: 'Network error. Please check your internet connection.',
      TIMEOUT_ERROR: 'Request timeout. Please try again.',
      CONNECTION_ERROR: 'Unable to connect to server. Please try again later.',
      
      // Authentication errors
      UNAUTHORIZED: 'Session expired. Please login again.',
      FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
      INVALID_CREDENTIALS: 'Invalid email or password.',
      ACCOUNT_LOCKED: 'Account is temporarily locked. Please try again later.',
      ACCOUNT_INACTIVE: 'Account is deactivated. Please contact support.',
      
      // Validation errors
      VALIDATION_ERROR: 'Please check your input and try again.',
      REQUIRED_FIELD: 'This field is required.',
      INVALID_EMAIL: 'Please enter a valid email address.',
      WEAK_PASSWORD: 'Password must be at least 6 characters with uppercase, lowercase, and number.',
      PASSWORD_MISMATCH: 'Passwords do not match.',
      
      // Server errors
      SERVER_ERROR: 'Server error. Please try again later.',
      NOT_FOUND: 'Resource not found.',
      CONFLICT: 'Resource already exists.',
      TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
      
      // Generic errors
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
      PARSE_ERROR: 'Invalid response from server.',
    };
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    if (!error) {
      return this.errorMessages.UNKNOWN_ERROR;
    }

    // Handle string errors
    if (typeof error === 'string') {
      return this.getLocalizedMessage(error);
    }

    // Handle Error objects
    if (error instanceof Error) {
      return this.getLocalizedMessage(error.message);
    }

    // Handle API response errors
    if (error.message) {
      return this.getLocalizedMessage(error.message);
    }

    // Handle validation errors array
    if (Array.isArray(error)) {
      return error.map(err => this.getLocalizedMessage(err.msg || err.message)).join(', ');
    }

    return this.errorMessages.UNKNOWN_ERROR;
  }

  /**
   * Get localized error message
   */
  getLocalizedMessage(message) {
    if (!message) {
      return this.errorMessages.UNKNOWN_ERROR;
    }

    // Check for specific error patterns
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
      return this.errorMessages.NETWORK_ERROR;
    }

    if (lowerMessage.includes('timeout')) {
      return this.errorMessages.TIMEOUT_ERROR;
    }

    if (lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
      return this.errorMessages.UNAUTHORIZED;
    }

    if (lowerMessage.includes('forbidden') || lowerMessage.includes('403')) {
      return this.errorMessages.FORBIDDEN;
    }

    if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
      return this.errorMessages.NOT_FOUND;
    }

    if (lowerMessage.includes('validation') || lowerMessage.includes('422')) {
      return this.errorMessages.VALIDATION_ERROR;
    }

    if (lowerMessage.includes('server error') || lowerMessage.includes('500')) {
      return this.errorMessages.SERVER_ERROR;
    }

    if (lowerMessage.includes('too many requests') || lowerMessage.includes('429')) {
      return this.errorMessages.TOO_MANY_REQUESTS;
    }

    if (lowerMessage.includes('invalid email')) {
      return this.errorMessages.INVALID_EMAIL;
    }

    if (lowerMessage.includes('password')) {
      if (lowerMessage.includes('weak') || lowerMessage.includes('strength')) {
        return this.errorMessages.WEAK_PASSWORD;
      }
      if (lowerMessage.includes('mismatch')) {
        return this.errorMessages.PASSWORD_MISMATCH;
      }
      if (lowerMessage.includes('invalid') || lowerMessage.includes('incorrect')) {
        return this.errorMessages.INVALID_CREDENTIALS;
      }
    }

    if (lowerMessage.includes('account locked')) {
      return this.errorMessages.ACCOUNT_LOCKED;
    }

    if (lowerMessage.includes('account') && lowerMessage.includes('inactive')) {
      return this.errorMessages.ACCOUNT_INACTIVE;
    }

    if (lowerMessage.includes('already exists') || lowerMessage.includes('duplicate')) {
      return this.errorMessages.CONFLICT;
    }

    // Return original message if no pattern matches
    return message;
  }

  /**
   * Format validation errors from API
   */
  formatValidationErrors(errors) {
    if (!errors) return '';

    if (Array.isArray(errors)) {
      return errors.map(error => {
        if (typeof error === 'string') {
          return error;
        }
        if (error.msg) {
          return error.msg;
        }
        if (error.message) {
          return error.message;
        }
        return 'Invalid input';
      }).join(', ');
    }

    if (typeof errors === 'object') {
      return Object.values(errors).join(', ');
    }

    return String(errors);
  }

  /**
   * Log error for debugging
   */
  logError(error, context = '') {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }
  }

  /**
   * Handle API error response
   */
  handleApiError(error, context = '') {
    this.logError(error, context);
    
    const message = this.getErrorMessage(error);
    
    return {
      message,
      originalError: error,
      context,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    if (!error) return false;

    const message = error.message || error.toString();
    const lowerMessage = message.toLowerCase();

    return lowerMessage.includes('network') ||
           lowerMessage.includes('timeout') ||
           lowerMessage.includes('server error') ||
           lowerMessage.includes('5');
  }

  /**
   * Get error severity level
   */
  getErrorSeverity(error) {
    if (!error) return 'low';

    const message = error.message || error.toString();
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('unauthorized') || 
        lowerMessage.includes('forbidden') ||
        lowerMessage.includes('account locked')) {
      return 'high';
    }

    if (lowerMessage.includes('network') || 
        lowerMessage.includes('timeout') ||
        lowerMessage.includes('server error')) {
      return 'medium';
    }

    return 'low';
  }
}

// Create and export a singleton instance
const errorHandler = new ErrorHandler();
export default errorHandler;









