/**
 * Token Utility
 * 
 * Utility untuk generate dan verify JWT tokens.
 * 
 * @module utils/token
 */

import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * 
 * @param {number} adminId - Admin ID
 * @returns {string} JWT token
 */
export const generateToken = (adminId) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 * 
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

