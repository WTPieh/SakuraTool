/**
 * @typedef {Object} CharacterSakura
 * @property {string} imageUri
 * @property {string} persona
 * @property {string} scenario
 * @property {Array<Conversation>} exampleConversation
 * @property {string} firstMessage
 * @property {string} name
 * @property {string} description
 * @property {string} id
 * @property {boolean} truncated
 * @property {boolean} nsfw
 * @property {string} creatorId
 * @property {string} creatorUsername
 * @property {string | null} creatorTier
 * @property {number} messageCount
 * @property {string} visibility
 * @property {string} createdAt
 * @property {Array<string>} tags
 * @property {boolean} favorited
 * @property {Array} moderationLabels
 * @property {boolean} explicitImage
 * @property {string} creatorImageUrl
 */

/**
 * @typedef {Object} Conversation
 * @property {string} role
 * @property {string} content
 * @property {string} type
 */

/**
 * @typedef {Object} CharacterSettings
 * @property {Array} memories
 * @property {string} nsfwStyle
 * @property {string} customPersona
 * @property {string} nsfwIntensity
 * @property {string} customScenario
 * @property {boolean} backgroundEnabled
 * @property {string} conversationStyle
 */

/**
 * @typedef {Object} UserSettings
 * @property {string} model
 * @property {string} biography
 * @property {Array<string>} hiddenTags
 * @property {boolean} animateText
 * @property {boolean} betaEnabled
 * @property {string} description
 * @property {string} displayName
 * @property {ManualParams} manualParams
 * @property {boolean} trainingMode
 * @property {boolean} discordPublic
 * @property {string} responseLength
 * @property {boolean} multipleOptionsEnabled
 */

/**
 * @typedef {Object} ManualParams
 * @property {number} minP
 * @property {number} temperature
 * @property {number} repetitionPenalty
 */

/**
 * @typedef {Object} UserTheme
 * @property {string} font
 * @property {string} pattern
 * @property {string} patternMode
 * @property {string | null} userChatColor
 * @property {string | null} characterChatColor
 */

/**
 * @typedef {Object} Roles
 * @property {string} sakuraPlusTier
 * @property {string} purchaseInterval
 * @property {Array<string>} discordRoles
 * @property {boolean} beta
 * @property {boolean} admin
 */

/**
 * @typedef {Object} InitialMessage
 * @property {string} role
 * @property {string} content
 * @property {string} id
 * @property {string} type
 */

/**
 * @typedef {Object} ChatData
 * @property {Character} character
 * @property {CharacterSettings} characterSettings
 * @property {UserSettings} userSettings
 * @property {UserTheme} userTheme
 * @property {Object} chatSettings
 * @property {Roles} roles
 * @property {Array<InitialMessage>} initialMessages
 * @property {boolean} initialHasMore
 */

/** @type {ChatData} */
/**
 * @typedef {Object} MetadataTool
 * @property {string} name
 * @property {string} version
 * @property {string} url
 */

/**
 * @typedef {Object} Metadata
 * @property {number} version
 * @property {number} created
 * @property {number} modified
 * @property {string | null} source
 * @property {MetadataTool} tool
 */

/**
 * @typedef {Object} Character
 * @property {string} char_name
 * @property {string} char_persona
 * @property {string} char_greeting
 * @property {string} world_scenario
 * @property {string} example_dialogue
 * @property {string} name
 * @property {string} description
 * @property {string} first_mes
 * @property {string} scenario
 * @property {string} mes_example
 * @property {string} personality
 * @property {Metadata} metadata
 */
