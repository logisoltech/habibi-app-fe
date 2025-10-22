// API utility functions for notifications management
// These functions interact with the server.js notification endpoints

// Base API URL - update this for production
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://habibi-fitness-server.onrender.com'

/**
 * Fetch notifications for a specific user
 * @param {string} userId - User ID
 * @param {boolean} unreadOnly - If true, only fetch unread notifications
 * @returns {Promise<object>} Notifications data
 */
export const fetchUserNotifications = async (userId, unreadOnly = false) => {
  try {
    const url = `${API_BASE_URL}/api/notifications/user/${userId}${unreadOnly ? '?unreadOnly=true' : ''}`
    console.log('🔔 Fetching notifications from:', url)
    console.log('📱 User ID:', userId)
    console.log('🌐 API Base URL:', API_BASE_URL)
    
    const response = await fetch(url)
    console.log('📡 Response status:', response.status, response.statusText)
    
    const data = await response.json()
    console.log('📦 Response data:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error('❌ API Error:', data)
      throw new Error(data.message || data.error || 'Failed to fetch notifications')
    }

    console.log(`✅ Fetched ${data.data?.length || 0} notifications, ${data.unreadCount || 0} unread`)
    return data
  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
    console.error('❌ Error type:', error.constructor.name)
    console.error('❌ Error message:', error.message)
    throw error
  }
}

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<object>} Response data
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to mark notification as read')
    }

    console.log('✅ Notification marked as read')
    return data
  } catch (error) {
    console.error('❌ Error marking notification as read:', error)
    throw error
  }
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<object>} Response data
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    // Fetch all unread notifications first
    const notificationsData = await fetchUserNotifications(userId, true)
    
    if (!notificationsData.data || notificationsData.data.length === 0) {
      return { success: true, message: 'No unread notifications' }
    }

    // Mark each as read
    const promises = notificationsData.data.map(notification => 
      markNotificationAsRead(notification.id)
    )

    await Promise.all(promises)

    console.log(`✅ Marked ${notificationsData.data.length} notifications as read`)
    return { success: true, message: 'All notifications marked as read' }
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Send a notification (for testing purposes)
 * @param {object} notificationData - { title, message, userId, type, priority }
 * @returns {Promise<object>} Response data
 */
export const sendTestNotification = async (notificationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: notificationData.title,
        message: notificationData.message,
        target: 'specific',
        userIds: [notificationData.userId],
        type: notificationData.type || 'general',
        priority: notificationData.priority || 'normal',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to send notification')
    }

    console.log('✅ Notification sent successfully')
    return data
  } catch (error) {
    console.error('❌ Error sending notification:', error)
    throw error
  }
}

