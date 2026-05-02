/**
 * @typedef {Object} Message
 * @property {number} id - Unique identifier for the message.
 * @property {string} type - Message sender type ('user' | 'bot').
 * @property {string} text - Message content.
 * @property {Date} timestamp - Time of message.
 * @property {boolean} [isMisinformation] - Flag for misinformation detection.
 */

/**
 * @typedef {Object} EligibilityResult
 * @property {boolean} isEligible - Whether the user is eligible to vote.
 * @property {string} reason - Detailed reason for the status.
 * @property {string} nextSteps - Recommended actions for the user.
 */

/**
 * @typedef {Object} ElectionType
 * @property {string} id - Unique ID for the election category.
 * @property {string} name - Display name.
 * @property {string} frequency - How often it occurs.
 * @property {string} icon - Lucide icon name.
 */
