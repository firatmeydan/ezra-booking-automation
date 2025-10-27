import { faker } from '@faker-js/faker';
import { TestConstants } from './testConstants';

/**
 * Test data generation utilities using Faker.js for realistic test data
 */
export class TestDataGenerator {
  /**
   * Generate a random first name
   */
  static getRandomFirstName(): string {
    return faker.person.firstName();
  }

  /**
   * Generate a random last name
   */
  static getRandomLastName(): string {
    return faker.person.lastName();
  }

  /**
   * Generate a unique email with timestamp to prevent collisions
   * @param domain - Email domain (default: testezra.com)
   */
  static getUniqueEmail(domain: string = 'testezra.com'): string {
    const timestamp = Date.now();
    const username = faker.internet.username().toLowerCase();
    return `${username}-${timestamp}@${domain}`;
  }

  /**
   * Generate a valid US phone number in format that matches form expectations
   * Using manual generation to ensure consistent format without extensions
   */
  static getRandomUSPhone(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
    const exchange = Math.floor(Math.random() * 900) + 100; // 100-999  
    const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `${areaCode}${exchange}${number}`;
  }

  /**
   * Generate complete user test data
   * Note: Password is static to ensure consistency and ease of debugging
   */
  static getRandomUserData() {
    return {
      firstName: this.getRandomFirstName(),
      lastName: this.getRandomLastName(),
      email: this.getUniqueEmail(),
      phone: this.getRandomUSPhone(),
      password: TestConstants.DEFAULT_PASSWORD
    };
  }

  /**
   * Seed the random generator for reproducible tests
   * Useful for debugging specific test scenarios
   */
  static seed(seedValue: number) {
    faker.seed(seedValue);
  }
}

