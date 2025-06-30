/**
 * Abstract Command interface for the Command Pattern
 * All commands must implement execute() and optionally undo()
 */
export class Command {
  constructor() {
    if (this.constructor === Command) {
      throw new Error('Command is an abstract class and cannot be instantiated');
    }
  }

  /**
   * Execute the command
   * @param {*} context - Execution context
   * @returns {*} Result of execution
   */
  execute(context = {}) {
    throw new Error('execute() must be implemented by subclass');
  }

  /**
   * Undo the command (optional)
   * @param {*} context - Execution context
   * @returns {*} Result of undo operation
   */
  undo(context = {}) {
    // Default implementation does nothing
    return null;
  }

  /**
   * Get command description for logging
   * @returns {string} Command description
   */
  getDescription() {
    return this.constructor.name;
  }

  /**
   * Check if command can be undone
   * @returns {boolean} True if command supports undo
   */
  canUndo() {
    return typeof this.undo === 'function' && this.undo !== Command.prototype.undo;
  }

  /**
   * Get command metadata
   * @returns {Object} Command metadata
   */
  getMetadata() {
    return {
      type: this.constructor.name,
      description: this.getDescription(),
      canUndo: this.canUndo(),
      timestamp: new Date().toISOString()
    };
  }
} 