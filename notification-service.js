/**
 * NOTIFICATION SERVICE - Email, SMS & Escalation System
 * Handles multi-channel notifications with automatic escalation
 */

class NotificationService {
  constructor() {
    this.emailAPI = null;
    this.smsAPI = null;
    this.escalationTimers = new Map(); // Track escalation timers
    this.init();
  }

  init() {
    // Initialize with multiple service providers for reliability
    this.initEmailService();
    this.initSMSService();
  }

  // ============================================================================
  // EMAIL SERVICE INTEGRATION (Multiple providers for reliability)
  // ============================================================================

  initEmailService() {
    // EmailJS integration (free tier: 200 emails/month)
    this.emailJS = {
      serviceID: 'service_smru_hostel', // Replace with your EmailJS service ID
      templateID: 'template_complaint', // Replace with your template ID
      userID: 'your-emailjs-user-id' // Replace with your EmailJS user ID
    };

    // Load EmailJS SDK dynamically
    if (!window.emailjs) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = () => {
        emailjs.init(this.emailJS.userID);
        console.log('📧 EmailJS initialized');
      };
      document.head.appendChild(script);
    }
  }

  async sendEmail(to, subject, content, priority = 'normal') {
    try {
      if (!window.emailjs) {
        throw new Error('EmailJS not loaded');
      }

      const templateParams = {
        to_email: to,
        subject: subject,
        message: content,
        priority: priority,
        timestamp: new Date().toLocaleString(),
        from_name: 'SMRU Hostel Care System'
      };

      const response = await emailjs.send(
        this.emailJS.serviceID,
        this.emailJS.templateID,
        templateParams
      );

      console.log('📧 Email sent successfully:', response);
      return { success: true, response };

    } catch (error) {
      console.error('📧 Email failed:', error);
      
      // Fallback: Use Supabase Edge Function for email
      try {
        const { data, error: supabaseError } = await supabaseAPI.client
          .functions.invoke('send-email', {
            body: { to, subject, content, priority }
          });
        
        if (supabaseError) throw supabaseError;
        return { success: true, provider: 'supabase' };
        
      } catch (fallbackError) {
        console.error('📧 Email fallback failed:', fallbackError);
        return { success: false, error: fallbackError.message };
      }
    }
  }

  // ============================================================================
  // SMS SERVICE INTEGRATION (Multiple providers)
  // ============================================================================

  initSMSService() {
    // Twilio integration (free trial credits available)
    this.twilioConfig = {
      accountSID: 'your-twilio-sid', // Replace with your Twilio SID
      authToken: 'your-twilio-token', // Replace with your auth token
      fromNumber: '+1234567890' // Replace with your Twilio number
    };

    // Fast2SMS (Indian SMS provider - very affordable)
    this.fast2sms = {
      apiKey: 'your-fast2sms-key', // Replace with Fast2SMS API key
      route: 'q', // Quick route
      language: 'english'
    };
  }

  async sendSMS(phoneNumber, message, priority = 'normal') {
    try {
      // Format phone number (remove spaces, add country code if needed)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Try Fast2SMS first (cheaper for Indian numbers)
      if (formattedPhone.startsWith('+91') || formattedPhone.startsWith('91')) {
        return await this.sendFast2SMS(formattedPhone, message);
      }

      // Fallback to Twilio for international
      return await this.sendTwilioSMS(formattedPhone, message);

    } catch (error) {
      console.error('📱 SMS failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendFast2SMS(phoneNumber, message) {
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '').replace(/^(\+91|91)/, '');
      
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': this.fast2sms.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: this.fast2sms.route,
          message: message,
          language: this.fast2sms.language,
          flash: 0,
          numbers: cleanPhone
        })
      });

      const data = await response.json();
      
      if (data.return === true) {
        console.log('📱 Fast2SMS sent successfully:', data);
        return { success: true, provider: 'fast2sms', data };
      } else {
        throw new Error(data.message || 'Fast2SMS failed');
      }

    } catch (error) {
      console.error('📱 Fast2SMS error:', error);
      // Fallback to Supabase Edge Function
      return await this.sendSupabaseSMS(phoneNumber, message);
    }
  }

  async sendTwilioSMS(phoneNumber, message) {
    try {
      // Use Supabase Edge Function to call Twilio (secure server-side)
      const { data, error } = await supabaseAPI.client
        .functions.invoke('send-sms', {
          body: {
            to: phoneNumber,
            message: message,
            provider: 'twilio'
          }
        });

      if (error) throw error;
      return { success: true, provider: 'twilio', data };

    } catch (error) {
      console.error('📱 Twilio SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSupabaseSMS(phoneNumber, message) {
    try {
      const { data, error } = await supabaseAPI.client
        .functions.invoke('send-sms', {
          body: { to: phoneNumber, message: message }
        });

      if (error) throw error;
      return { success: true, provider: 'supabase' };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  formatPhoneNumber(phone) {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code for Indian numbers if missing
    if (cleaned.length === 10 && !cleaned.startsWith('91')) {
      cleaned = '91' + cleaned;
    }
    
    return '+' + cleaned;
  }

  // ============================================================================
  // COMPLAINT NOTIFICATION ORCHESTRATION
  // ============================================================================

  async notifyComplaintSubmission(complaint, officials) {
    console.log('🔔 Starting notification process for complaint:', complaint.refNumber);
    
    const notifications = [];
    const timestamp = new Date().toLocaleString();

    for (const official of officials) {
      try {
        // 1. Send In-app notification (instant)
        const inAppResult = await this.sendInAppNotification(official, complaint);
        notifications.push({ type: 'in-app', official: official.email, success: inAppResult.success });

        // 2. Send Email notification (within 1 minute)
        const emailContent = this.generateEmailContent(complaint, official);
        const emailResult = await this.sendEmail(
          official.email,
          `🚨 New ${complaint.urgency} Complaint: ${complaint.refNumber}`,
          emailContent,
          complaint.urgency.toLowerCase()
        );
        notifications.push({ type: 'email', official: official.email, success: emailResult.success });

        // 3. Send SMS notification (within 2 minutes for urgent/critical)
        if (complaint.urgency === 'Critical' || complaint.urgency === 'High') {
          if (official.phone) {
            const smsContent = this.generateSMSContent(complaint);
            const smsResult = await this.sendSMS(official.phone, smsContent, complaint.urgency.toLowerCase());
            notifications.push({ type: 'sms', official: official.phone, success: smsResult.success });
          }
        }

        // 4. Setup 24-hour escalation timer
        this.setupEscalationTimer(complaint.id, complaint, official);

      } catch (error) {
        console.error('🔔 Notification failed for official:', official.email, error);
        notifications.push({ type: 'error', official: official.email, error: error.message });
      }
    }

    // Log notification results
    await this.logNotificationResults(complaint.id, notifications);
    
    return notifications;
  }

  async sendInAppNotification(official, complaint) {
    try {
      const notification = {
        id: "notif_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        recipientId: official.id,
        title: `🚨 New ${complaint.urgency} Complaint`,
        message: `${complaint.title} (${complaint.refNumber}) submitted by ${complaint.studentName} in ${complaint.block} Room ${complaint.room}. Category: ${complaint.category}`,
        read: false,
        timestamp: new Date().toISOString(),
        complaintId: complaint.id,
        urgency: complaint.urgency,
        type: 'new_complaint'
      };

      // Add to local storage
      if (window.app && window.app.store) {
        window.app.store.addNotification(notification);
      }

      // Add to Supabase
      await supabaseAPI.addNotification(notification);

      // Play notification sound for critical/high priority
      if (complaint.urgency === 'Critical' || complaint.urgency === 'High') {
        this.playUrgentNotificationSound();
      }

      return { success: true };

    } catch (error) {
      console.error('📱 In-app notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  generateEmailContent(complaint, official) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #e11d48; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .urgent { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
        .details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #64748b; color: white; padding: 15px; text-align: center; }
        .btn { background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 New Hostel Complaint Alert</h1>
        <p>SMRU Hostel Care System</p>
    </div>
    
    <div class="content">
        <div class="urgent">
            <strong>⚡ URGENT ATTENTION REQUIRED</strong><br>
            A new <strong>${complaint.urgency}</strong> priority complaint has been submitted and assigned to your department.
        </div>
        
        <div class="details">
            <h3>📋 Complaint Details</h3>
            <p><strong>Reference:</strong> ${complaint.refNumber}</p>
            <p><strong>Title:</strong> ${complaint.title}</p>
            <p><strong>Category:</strong> ${complaint.category} → ${complaint.subcategory}</p>
            <p><strong>Location:</strong> ${complaint.block}, Room ${complaint.room}</p>
            <p><strong>Student:</strong> ${complaint.studentName} (${complaint.studentEmail})</p>
            <p><strong>Urgency:</strong> <span style="color: ${complaint.urgency === 'Critical' ? '#dc2626' : complaint.urgency === 'High' ? '#ea580c' : '#16a34a'}">${complaint.urgency}</span></p>
            <p><strong>Submitted:</strong> ${new Date(complaint.createdAt).toLocaleString()}</p>
        </div>
        
        <div class="details">
            <h3>📝 Description</h3>
            <p>${complaint.description}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${window.location.origin}" class="btn">🚀 View & Respond Now</a>
        </div>
        
        <div class="urgent">
            <strong>⏰ Response Deadline</strong><br>
            Please acknowledge this complaint within 4 hours. If no response is received within 24 hours, this will be automatically escalated to higher authorities.
        </div>
    </div>
    
    <div class="footer">
        <p>SMRU Hostel Care - Automated Notification System</p>
        <p>This is an automated message. Please do not reply to this email.</p>
    </div>
</body>
</html>`;
  }

  generateSMSContent(complaint) {
    return `🚨 SMRU HOSTEL ALERT
New ${complaint.urgency} complaint: ${complaint.refNumber}
${complaint.title}
Location: ${complaint.block} Rm ${complaint.room}
Student: ${complaint.studentName}
Login to respond: ${window.location.origin}
URGENT - Response required within 4 hours`;
  }

  // ============================================================================
  // 24-HOUR ESCALATION SYSTEM
  // ============================================================================

  setupEscalationTimer(complaintId, complaint, assignedOfficial) {
    // Clear any existing timer
    if (this.escalationTimers.has(complaintId)) {
      clearTimeout(this.escalationTimers.get(complaintId));
    }

    console.log(`⏰ Setting up 24-hour escalation timer for complaint ${complaint.refNumber}`);

    // Set 24-hour timer (86400000 ms = 24 hours)
    const timer = setTimeout(async () => {
      await this.handleEscalation(complaintId, complaint, assignedOfficial);
    }, 24 * 60 * 60 * 1000);

    this.escalationTimers.set(complaintId, timer);

    // Also set intermediate reminders
    this.setReminderTimers(complaintId, complaint, assignedOfficial);
  }

  setReminderTimers(complaintId, complaint, assignedOfficial) {
    // 4-hour reminder
    setTimeout(async () => {
      if (await this.isComplaintStillPending(complaintId)) {
        await this.sendReminderNotification(complaint, assignedOfficial, '4 hours');
      }
    }, 4 * 60 * 60 * 1000);

    // 12-hour reminder
    setTimeout(async () => {
      if (await this.isComplaintStillPending(complaintId)) {
        await this.sendReminderNotification(complaint, assignedOfficial, '12 hours');
      }
    }, 12 * 60 * 60 * 1000);

    // 20-hour final warning
    setTimeout(async () => {
      if (await this.isComplaintStillPending(complaintId)) {
        await this.sendFinalWarningNotification(complaint, assignedOfficial);
      }
    }, 20 * 60 * 60 * 1000);
  }

  async handleEscalation(complaintId, complaint, assignedOfficial) {
    try {
      console.log(`🚨 ESCALATING complaint ${complaint.refNumber} - No response in 24 hours`);

      // Check if complaint is still pending
      if (!(await this.isComplaintStillPending(complaintId))) {
        console.log(`✅ Complaint ${complaint.refNumber} was resolved, cancelling escalation`);
        return;
      }

      // Get escalation hierarchy
      const escalationOfficials = await this.getEscalationOfficials(assignedOfficial);

      // Update complaint status
      await this.updateComplaintForEscalation(complaintId, escalationOfficials);

      // Send escalation notifications
      await this.sendEscalationNotifications(complaint, assignedOfficial, escalationOfficials);

      // Log escalation
      await this.logEscalation(complaint, assignedOfficial, escalationOfficials);

    } catch (error) {
      console.error('🚨 Escalation failed:', error);
    } finally {
      // Clean up timer
      this.escalationTimers.delete(complaintId);
    }
  }

  async isComplaintStillPending(complaintId) {
    try {
      const complaint = await supabaseAPI.getComplaint(complaintId);
      return complaint && ['Submitted', 'Acknowledged'].includes(complaint.status);
    } catch (error) {
      console.error('Error checking complaint status:', error);
      return true; // Assume pending if we can't check
    }
  }

  async getEscalationOfficials(assignedOfficial) {
    try {
      // Get users with higher roles
      const allUsers = await supabaseAPI.getUsers();
      
      const escalationHierarchy = {
        'staff': ['warden', 'admin'],
        'warden': ['admin'],
        'admin': [] // Top level
      };

      const targetRoles = escalationHierarchy[assignedOfficial.role] || ['warden', 'admin'];
      
      return allUsers.filter(user => 
        targetRoles.includes(user.role) && 
        user.status === 'active'
      );

    } catch (error) {
      console.error('Error getting escalation officials:', error);
      return [];
    }
  }

  async updateComplaintForEscalation(complaintId, escalationOfficials) {
    try {
      const updates = {
        status: 'Escalated',
        escalated: true,
        escalatedAt: new Date().toISOString(),
        escalatedTo: escalationOfficials.map(o => o.id).join(',')
      };

      await supabaseAPI.updateComplaint(complaintId, updates);

    } catch (error) {
      console.error('Error updating complaint for escalation:', error);
    }
  }

  async sendEscalationNotifications(complaint, originalOfficial, escalationOfficials) {
    const escalationMessage = `
🚨 COMPLAINT ESCALATION ALERT

Complaint ${complaint.refNumber} has been ESCALATED due to no response within 24 hours.

Original Assignment: ${originalOfficial.name} (${originalOfficial.department})
Escalated To: ${escalationOfficials.map(o => o.name).join(', ')}

IMMEDIATE ATTENTION REQUIRED

${complaint.title}
Location: ${complaint.block}, Room ${complaint.room}
Student: ${complaint.studentName}
Category: ${complaint.category}
Urgency: ${complaint.urgency}
Submitted: ${new Date(complaint.createdAt).toLocaleString()}

Login immediately: ${window.location.origin}
`;

    for (const official of escalationOfficials) {
      // Send ALL notification types for escalations
      await this.sendInAppNotification(official, {...complaint, title: `🚨 ESCALATED: ${complaint.title}`});
      await this.sendEmail(
        official.email,
        `🚨 URGENT ESCALATION: Complaint ${complaint.refNumber}`,
        escalationMessage,
        'critical'
      );
      
      if (official.phone) {
        await this.sendSMS(
          official.phone,
          `🚨 ESCALATION ALERT: Complaint ${complaint.refNumber} escalated due to no response. IMMEDIATE ACTION REQUIRED. Login: ${window.location.origin}`,
          'critical'
        );
      }
    }
  }

  async sendReminderNotification(complaint, official, timeElapsed) {
    const reminderMessage = `⏰ REMINDER: Complaint ${complaint.refNumber} submitted ${timeElapsed} ago still awaits your response. Please acknowledge within ${24 - parseInt(timeElapsed)} hours to avoid escalation.`;
    
    await this.sendSMS(official.phone, reminderMessage, 'high');
    await this.sendInAppNotification(official, {...complaint, title: `⏰ Reminder: ${complaint.title}`});
  }

  async sendFinalWarningNotification(complaint, official) {
    const warningMessage = `🚨 FINAL WARNING: Complaint ${complaint.refNumber} will be ESCALATED in 4 hours if no response. URGENT ACTION REQUIRED.`;
    
    await this.sendSMS(official.phone, warningMessage, 'critical');
    await this.sendEmail(
      official.email,
      `🚨 FINAL WARNING: Complaint ${complaint.refNumber} - 4 Hours to Escalation`,
      warningMessage,
      'critical'
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  playUrgentNotificationSound() {
    try {
      // Create urgent notification sound
      if (window.app && window.app.sound) {
        window.app.sound.playNotificationChime();
        
        // Play additional urgent beeps for critical issues
        setTimeout(() => window.app.sound.playNotificationChime(), 1000);
        setTimeout(() => window.app.sound.playNotificationChime(), 2000);
      }
    } catch (error) {
      console.error('Sound notification failed:', error);
    }
  }

  async logNotificationResults(complaintId, notifications) {
    try {
      const logEntry = {
        complaintId,
        notifications,
        timestamp: new Date().toISOString(),
        totalSent: notifications.filter(n => n.success).length,
        totalFailed: notifications.filter(n => !n.success).length
      };

      // Log to Supabase
      await supabaseAPI.logNotification(logEntry);
      
      console.log('📊 Notification results logged:', logEntry);

    } catch (error) {
      console.error('Failed to log notification results:', error);
    }
  }

  async logEscalation(complaint, originalOfficial, escalationOfficials) {
    try {
      const escalationLog = {
        complaintId: complaint.id,
        complaintRef: complaint.refNumber,
        originalOfficial: originalOfficial.id,
        escalatedTo: escalationOfficials.map(o => o.id),
        escalationReason: 'No response within 24 hours',
        timestamp: new Date().toISOString()
      };

      await supabaseAPI.logEscalation(escalationLog);

    } catch (error) {
      console.error('Failed to log escalation:', error);
    }
  }

  // Cancel escalation when complaint is responded to
  cancelEscalation(complaintId) {
    if (this.escalationTimers.has(complaintId)) {
      clearTimeout(this.escalationTimers.get(complaintId));
      this.escalationTimers.delete(complaintId);
      console.log(`✅ Escalation cancelled for complaint ${complaintId}`);
    }
  }

  // Get notification status for admin dashboard
  getNotificationStats() {
    return {
      activeEscalations: this.escalationTimers.size,
      escalationTimers: Array.from(this.escalationTimers.keys())
    };
  }
}

// Global instance
window.notificationService = new NotificationService();