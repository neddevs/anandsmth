/**
 * Enhanced API Service
 * Provides a clean interface for all API operations
 */
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    // this.baseURL = process.env.NODE_ENV === 'production'
    //   ? '/api'
    //   : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.timeout = 10000;
    console.log("baseURL: ", this.baseURL)
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Get user data from localStorage
  getCurrentUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Set user data in localStorage
  setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    const userData = this.getCurrentUserData();
    return !!(token && userData);
  }

  // Get request headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    let data;

    try {
      //data = await response.json();
      const text = await response.text();
      console.log("RAW RESPONSE:", text);

      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      switch (response.status) {
        case 401:
          this.clearAuthData();
          throw new Error('Session expired. Please login again.');
        case 403:
          throw new Error('Access denied. You do not have permission to perform this action.');
        case 404:
          throw new Error('Resource not found.');
        case 422:
          throw new Error(data.message || 'Validation failed.');
        case 429:
          throw new Error('Too many requests. Please try again later.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || `Request failed with status ${response.status}`);
      }
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = this.baseURL.startsWith('http') 
      ? `${this.baseURL}${endpoint}` 
      : `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const config = {
      method: 'GET',
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      // console.log(`🌐 Making request to: ${url}`);
      const response = await fetch(url, config);
      // console.log(`📡 Response status: ${response.status}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('❌ Request error:', error);

      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Network error. Please check your connection to ${this.baseURL}`);
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend at ${this.baseURL}. Please make sure the backend is running.`);
      }

      throw error;
    }
  }

  // --- Authentication methods ---

  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        includeAuth: false,
      });

      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.setUserData(response.data.user);
      }

      return {
        success: response.success,
        message: response.message,
        data: response.data,
        user: response.data?.user,
        token: response.data?.token
      };
    } catch (error) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        includeAuth: false,
      });

      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.setUserData(response.data.user);
      }

      return {
        success: response.success,
        message: response.message,
        data: response.data,
        user: response.data?.user,
        token: response.data?.token
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  async googleLogin(googleData) {
    try {
      const response = await this.request('/auth/google', {
        method: 'POST',
        body: JSON.stringify(googleData),
        includeAuth: false, // No auth token needed for login
      });

      // Handle success just like the regular login
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.setUserData(response.data.user);
      }

      return {
        success: response.success,
        message: response.message,
        data: response.data,
        user: response.data?.user,
        token: response.data?.token
      };
    } catch (error) {
      throw new Error(error.message || 'Google login failed. Please try again.');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        includeAuth: false,
      });
      return response; // Will return { success: true, message: '...' }
    } catch (error) {
      throw new Error(error.message || 'Failed to send reset email.');
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await this.request(`/auth/reset-password/${token}`, {
        method: 'PUT',
        body: JSON.stringify({ password }),
        includeAuth: false,
      });

      // If successful, log the user in with the new token
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password.');
    }
  }

  // -----------------------------

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me');

      if (response.success && response.data.user) {
        this.setUserData(response.data.user);
      }

      return {
        success: response.success,
        data: response.data,
        user: response.data?.user
      };
    } catch (error) {
      this.clearAuthData();
      throw new Error(error.message || 'Failed to get user data.');
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.success && response.data.user) {
        this.setUserData(response.data.user);
      }

      return {
        success: response.success,
        message: response.message,
        data: response.data,
        user: response.data?.user
      };
    } catch (error) {
      throw new Error(error.message || 'Profile update failed. Please try again.');
    }
  }

  async logout() {
    try {
      // This request can fail if the token is already expired, which is fine.
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout API call failed, but clearing data locally anyway.', error);
    } finally {
      this.clearAuthData();
    }
  }

  // --- Booking Method ---
  async createBooking(bookingData) {
    try {
      const response = await this.request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create booking.');
    }
  }

  // --- Payment Methods ---
  async createRazorpayOrder(orderDetails) {
    try {
      const response = await this.request('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify(orderDetails),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create Razorpay order.');
    }
  }

  async verifyRazorpayPayment(paymentDetails) {
    try {
      const response = await this.request('/payment/verify-payment', {
        method: 'POST',
        body: JSON.stringify(paymentDetails),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Payment verification failed.');
    }
  }

  // --- Health check ---
  async healthCheck() {
    try {
      const response = await this.request('/health', {
        includeAuth: false,
      });
      return {
        success: response.success,
        message: response.message,
        data: response
      };
    } catch (error) {
      throw new Error(error.message || 'Health check failed.');
    }
  }

  // --- For User Dashboard ---
  async getUserBookings() {
    try {
      // The endpoint matches the one we defined in our backend routes
      const response = await this.request('/bookings/my-bookings');
      return response; // Will return { success: true, data: [...] }
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch your bookings.');
    }
  }

  // --- For admin dashboard ---
  async getAllBookings(params = {}) {
    // This allows for future pagination/filtering, e.g., getAllBookings({ page: 2, status: 'confirmed' })
    try {
      const query = new URLSearchParams(params).toString();
      const response = await this.request(`/bookings?${query}`);
      return response; // Will return { success: true, data: [...], pagination: {...} }
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch all bookings.');
    }
  }

  async updateBookingStatus(bookingId, updateData) {
    // updateData will be an object like { status: 'completed', liveStreamLink: '...' }
    try {
      const response = await this.request(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      return response; // Will return { success: true, message: '...' }
    } catch (error) {
      throw new Error(error.message || 'Failed to update booking status.');
    }
  }

  // --- Admin Product Store Methods ---
  // @desc    Get all products (Public)
  async getAllProducts() {
    try {
      const response = await this.request('/products');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products.');
    }
  }

  // @desc    Get a single product (Public)
  async getProductById(productId) {
    try {
      const response = await this.request(`/products/${productId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch product details.');
    }
  }

  async createProduct(productData) {
    try {
      // The 'protect' and 'authorize' middleware on the backend will handle security
      const response = await this.request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create product.');
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await this.request(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update product.');
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await this.request(`/products/${productId}`, {
        method: 'DELETE',
      });
      return response; // Should return { success: true, message: 'Product removed' }
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product.');
    }
  }

  async createStoreOrder(orderData) {
    try {
      const response = await this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create order.');
    }
  }

  // For user dashboard
  async getMyOrders() {
    try {
      const response = await this.request('/orders/my-orders');
      return response; // Will return { success: true, data: [...] }
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch your orders.');
    }
  }

  // for admin dashboard
  async getAllOrders() {
    try {
      const response = await this.request('/orders');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch all orders.');
    }
  }

  async updateOrderStatus(orderId, statusData) {
    // statusData should be an object like { status: 'Shipped' }
    try {
      const response = await this.request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update order status.');
    }
  }

  // --- Admin Course Methods ---
  // == Courses ==
  async getAllCoursesAdmin() {
    try {
      const response = await this.request('/courses');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch courses.');
    }
  }

  async createCourse(courseData) {
    try {
      const response = await this.request('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create course.');
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await this.request(`/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update course.');
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await this.request(`/courses/${courseId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete course.');
    }
  }

  async getCourseByIdForAdmin(courseId) {
    try {
      const response = await this.request(`/courses/${courseId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch course details.');
    }
  }

  // == Lessons ==
  async addLessonToModule(moduleId, lessonData) {
    try {
      const response = await this.request(`/courses/modules/${moduleId}/lessons`, {
        method: 'POST',
        body: JSON.stringify(lessonData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add lesson.');
    }
  }

  async updateLesson(lessonId, lessonData) {
    try {
      const response = await this.request(`/courses/lessons/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify(lessonData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update lesson.');
    }
  }

  async deleteLesson(lessonId) {
    try {
      const response = await this.request(`/courses/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete lesson.');
    }
  }

  // == Modules ==
  async addModuleToCourse(courseId, moduleData) {
    try {
      const response = await this.request(`/courses/${courseId}/modules`, {
        method: 'POST',
        body: JSON.stringify(moduleData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add module.');
    }
  }

  async updateModule(moduleId, moduleData) {
    try {
      const response = await this.request(`/courses/modules/${moduleId}`, {
        method: 'PUT',
        body: JSON.stringify(moduleData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update module.');
    }
  }

  async deleteModule(moduleId) {
    try {
      const response = await this.request(`/courses/modules/${moduleId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete module.');
    }
  }

  // --- Public Course Methods ---
  async getAllPublishedCourses() {
    try {
      const response = await this.request('/courses/public');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch courses.');
    }
  }

  async getPublicCourseDetails(courseId) {
    try {
      const response = await this.request(`/courses/public/${courseId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch course details.');
    }
  }

  // --- User Course Methods ---
  async enrollInFreeCourse(courseId) {
    try {
      const response = await this.request(`/courses/${courseId}/enroll`, {
        method: 'POST',
      });
      return response; // Will return { success: true, message: '...' }
    } catch (error) {
      throw new Error(error.message || 'Failed to enroll in course.');
    }
  }

  async enrollInPaidCourse(courseId) {
    try {
      const response = await this.request(`/courses/${courseId}/enroll-paid`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to enroll in paid course.');
    }
  }

  async getEnrolledCourse(courseId) {
    try {
      // This endpoint is protected and returns full course data for enrolled users
      const response = await this.request(`/courses/${courseId}/enrolled`);
      return response; // Will return { success: true, data: { course: {...}, enrollment: {...} } }
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch enrolled course content.');
    }
  }

  async markLessonAsComplete(lessonId) {
    try {
      const response = await this.request(`/courses/lessons/${lessonId}/complete`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to mark lesson as complete.');
    }
  }

  async getMyEnrollments() {
    try {
      const response = await this.request('/courses/my-enrollments');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch your enrolled courses.');
    }
  }

  // --- Admin Catalogue Methods ---

  async getAllCatalogues() {
    try {
      const response = await this.request('/catalogues');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch catalogues.');
    }
  }

  async createCatalogue(catalogueData) {
    try {
      const response = await this.request('/catalogues', {
        method: 'POST',
        body: JSON.stringify(catalogueData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create catalogue.');
    }
  }

  async updateCatalogue(catalogueId, catalogueData) {
    try {
      const response = await this.request(`/catalogues/${catalogueId}`, {
        method: 'PUT',
        body: JSON.stringify(catalogueData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update catalogue.');
    }
  }

  async deleteCatalogue(catalogueId) {
    try {
      const response = await this.request(`/catalogues/${catalogueId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete catalogue.');
    }
  }

}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;