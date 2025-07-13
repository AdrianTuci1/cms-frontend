/**
 * CRUD Strategy - Strategy Pattern implementation for CRUD operations
 * Provides different strategies for different business types and operations
 */

/**
 * Base CRUD Strategy - Abstract base class for all CRUD strategies
 */
export class BaseCRUDStrategy {
  constructor(businessType = 'dental') {
    this.businessType = businessType;
  }

  /**
   * Execute CRUD operation
   * @param {string} operation - Operation type (create, read, update, delete)
   * @param {string} resource - Resource name
   * @param {Object} data - Operation data
   * @returns {Object} Operation result
   */
  execute(operation, resource, data = {}) {
    const methodName = `${operation}${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
    
    if (typeof this[methodName] === 'function') {
      return this[methodName](data);
    }
    
    // Fallback to generic operation
    return this[`generic${operation.charAt(0).toUpperCase() + operation.slice(1)}`](resource, data);
  }

  /**
   * Generic create operation
   */
  genericCreate(resource, data) {
    return {
      success: true,
      data: { ...data, id: Date.now(), createdAt: new Date().toISOString() },
      message: `${resource} created using generic strategy`
    };
  }

  /**
   * Generic read operation
   */
  genericRead(resource, filters = {}) {
    return {
      success: true,
      data: [],
      message: `${resource} read using generic strategy`
    };
  }

  /**
   * Generic update operation
   */
  genericUpdate(resource, data) {
    return {
      success: true,
      data: { ...data, updatedAt: new Date().toISOString() },
      message: `${resource} updated using generic strategy`
    };
  }

  /**
   * Generic delete operation
   */
  genericDelete(resource, data) {
    return {
      success: true,
      message: `${resource} deleted using generic strategy`
    };
  }

  /**
   * Validate data according to business rules
   */
  validateData(data, resource) {
    return { isValid: true, errors: [] };
  }

  /**
   * Check if operation is allowed
   */
  isOperationAllowed(operation, data) {
    return true;
  }

  /**
   * Process data according to business rules
   */
  processData(data, resource) {
    return data;
  }

  /**
   * Process filters according to business rules
   */
  processFilters(filters, resource) {
    return filters;
  }

  /**
   * Get strategy name
   */
  getName() {
    return `${this.businessType}CRUDStrategy`;
  }
}

/**
 * Dental CRUD Strategy - Specific strategy for dental business
 */
export class DentalCRUDStrategy extends BaseCRUDStrategy {
  constructor() {
    super('dental');
  }

  createAppointment(data) {
    // Dental-specific appointment creation logic
    const appointment = {
      ...data,
      id: Date.now(),
      type: 'dental',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      businessType: this.businessType
    };

    return {
      success: true,
      data: appointment,
      message: 'Dental appointment created successfully'
    };
  }

  createClient(data) {
    // Dental-specific client creation logic
    const client = {
      ...data,
      id: Date.now(),
      type: 'dental_patient',
      status: 'active',
      createdAt: new Date().toISOString(),
      businessType: this.businessType
    };

    return {
      success: true,
      data: client,
      message: 'Dental client created successfully'
    };
  }

  validateData(data, resource) {
    const errors = [];

    if (resource === 'appointment' || resource === 'timeline') {
      if (!data.clientName) errors.push('Client name is required');
      if (!data.date) errors.push('Appointment date is required');
      if (!data.displayTreatment) errors.push('Treatment is required');
    }

    if (resource === 'client') {
      if (!data.name) errors.push('Client name is required');
      if (!data.phone) errors.push('Phone number is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  processData(data, resource) {
    if (resource === 'appointment' || resource === 'timeline') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'dental_care'
      };
    }

    if (resource === 'client') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'dental_patient'
      };
    }

    return data;
  }
}

/**
 * Gym CRUD Strategy - Specific strategy for gym business
 */
export class GymCRUDStrategy extends BaseCRUDStrategy {
  constructor() {
    super('gym');
  }

  createMember(data) {
    // Gym-specific member creation logic
    const member = {
      ...data,
      id: Date.now(),
      type: 'gym_member',
      status: 'active',
      membershipStartDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      businessType: this.businessType
    };

    return {
      success: true,
      data: member,
      message: 'Gym member created successfully'
    };
  }

  createPackage(data) {
    // Gym-specific package creation logic
    const package_ = {
      ...data,
      id: Date.now(),
      type: 'gym_package',
      status: 'active',
      createdAt: new Date().toISOString(),
      businessType: this.businessType
    };

    return {
      success: true,
      data: package_,
      message: 'Gym package created successfully'
    };
  }

  validateData(data, resource) {
    const errors = [];

    if (resource === 'member') {
      if (!data.name) errors.push('Member name is required');
      if (!data.email) errors.push('Email is required');
      if (!data.membershipType) errors.push('Membership type is required');
    }

    if (resource === 'package') {
      if (!data.name) errors.push('Package name is required');
      if (!data.price) errors.push('Price is required');
      if (!data.duration) errors.push('Duration is required');
    }

    if (resource === 'timeline') {
      if (!data.memberName) errors.push('Member name is required');
      if (!data.date) errors.push('Date is required');
      if (!data.activity) errors.push('Activity is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  processData(data, resource) {
    if (resource === 'member') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'gym_member'
      };
    }

    if (resource === 'package') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'gym_package'
      };
    }

    if (resource === 'timeline') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'gym_timeline'
      };
    }

    return data;
  }
}

/**
 * Hotel CRUD Strategy - Specific strategy for hotel business
 */
export class HotelCRUDStrategy extends BaseCRUDStrategy {
  constructor() {
    super('hotel');
  }

  createRoom(data) {
    // Hotel-specific room creation logic
    const room = {
      ...data,
      id: Date.now(),
      type: 'hotel_room',
      status: 'available',
      createdAt: new Date().toISOString(),
      businessType: this.businessType
    };

    return {
      success: true,
      data: room,
      message: 'Hotel room created successfully'
    };
  }

  createBooking(data) {
    // Hotel-specific booking creation logic
    const booking = {
      ...data,
      id: Date.now(),
      type: 'hotel_booking',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      businessType: this.businessType
    };

    return {
      success: true,
      data: booking,
      message: 'Hotel booking created successfully'
    };
  }

  validateData(data, resource) {
    const errors = [];

    if (resource === 'room') {
      if (!data.roomNumber) errors.push('Room number is required');
      if (!data.roomType) errors.push('Room type is required');
      if (!data.price) errors.push('Price is required');
    }

    if (resource === 'booking') {
      if (!data.guestName) errors.push('Guest name is required');
      if (!data.checkInDate) errors.push('Check-in date is required');
      if (!data.checkOutDate) errors.push('Check-out date is required');
      if (!data.roomId) errors.push('Room ID is required');
    }

    if (resource === 'timeline') {
      if (!data.guestName) errors.push('Guest name is required');
      if (!data.checkInDate) errors.push('Check-in date is required');
      if (!data.roomNumber) errors.push('Room number is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  processData(data, resource) {
    if (resource === 'room') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'hotel_room'
      };
    }

    if (resource === 'booking') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'hotel_booking'
      };
    }

    if (resource === 'timeline') {
      return {
        ...data,
        businessType: this.businessType,
        category: 'hotel_timeline'
      };
    }

    return data;
  }
}

/**
 * CRUD Strategy Factory - Creates appropriate strategy based on business type
 */
export class CRUDStrategyFactory {
  constructor() {
    this.strategies = new Map();
    this.registerDefaultStrategies();
  }

  registerDefaultStrategies() {
    this.register('dental', DentalCRUDStrategy);
    this.register('gym', GymCRUDStrategy);
    this.register('hotel', HotelCRUDStrategy);
  }

  register(businessType, strategyClass) {
    this.strategies.set(businessType, strategyClass);
  }

  create(businessType) {
    const StrategyClass = this.strategies.get(businessType);
    
    if (!StrategyClass) {
      throw new Error(`No strategy found for business type: ${businessType}`);
    }

    return new StrategyClass();
  }

  getAvailableStrategies() {
    return Array.from(this.strategies.keys());
  }
}

// Export singleton instance
export const crudStrategyFactory = new CRUDStrategyFactory(); 