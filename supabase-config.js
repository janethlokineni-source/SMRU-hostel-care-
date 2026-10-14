/**
 * SUPABASE CONFIGURATION & CONNECTION
 * Backend Integration for SMRU Hostel Care
 */

// ============================================================================
// SUPABASE CONFIGURATION
// ============================================================================

// TODO: Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// DATABASE API FUNCTIONS
// ============================================================================

class SupabaseAPI {
  constructor() {
    this.client = supabase;
  }

  // ========================================================================
  // AUTHENTICATION METHODS
  // ========================================================================

  async signUpStudent(userData) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await this.client.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: 'student'
          }
        }
      });

      if (authError) throw authError;

      // Create profile record
      const { data: profileData, error: profileError } = await this.client
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          college_email: userData.email,
          role: 'student',
          hostel_block: userData.hostel_block,
          room_number: userData.room_number
        });

      if (profileError) throw profileError;

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Student signup error:', error);
      return { success: false, error: error.message };
    }
  }

  async signInUser(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user profile
      const profile = await this.getUserProfile(data.user.id);
      
      return { 
        success: true, 
        user: data.user, 
        profile: profile.data 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user } } = await this.client.auth.getUser();
      if (user) {
        const profile = await this.getUserProfile(user.id);
        return { user, profile: profile.data };
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // ========================================================================
  // USER PROFILE METHODS
  // ========================================================================

  async getUserProfile(userId) {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // COMPLAINT METHODS
  // ========================================================================

  async submitComplaint(complaintData) {
    try {
      const { data, error } = await this.client
        .from('complaints')
        .insert({
          student_id: complaintData.student_id,
          category: complaintData.category,
          subcategory: complaintData.subcategory,
          title: complaintData.title,
          description: complaintData.description,
          block: complaintData.block,
          room: complaintData.room,
          urgency: complaintData.urgency,
          assigned_department: complaintData.assigned_department,
          contact_preference: complaintData.contact_preference
        })
        .select()
        .single();

      if (error) throw error;

      // Create audit log
      await this.createAuditLog(
        complaintData.student_id,
        'complaint_submitted',
        `complaints:${data.id}`,
        `New complaint submitted: ${complaintData.title}`
      );

      // Create notification for department staff
      await this.notifyDepartmentStaff(data.assigned_department, data);

      return { success: true, data };
    } catch (error) {
      console.error('Submit complaint error:', error);
      return { success: false, error: error.message };
    }
  }

  async getComplaintsByUser(userId) {
    try {
      const { data, error } = await this.client
        .from('complaints')
        .select(`
          *,
          complaint_comments(
            id,
            message,
            visibility,
            created_at,
            author:profiles(name, role)
          ),
          assigned_official:profiles(name, college_email)
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get complaints error:', error);
      return { success: false, error: error.message };
    }
  }

  async getComplaintsByDepartment(departmentName) {
    try {
      const { data, error } = await this.client
        .from('complaints')
        .select(`
          *,
          student:profiles(name, hostel_block, room_number, college_email),
          complaint_comments(
            id,
            message,
            visibility,
            created_at,
            author:profiles(name, role)
          )
        `)
        .eq('assigned_department', departmentName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get department complaints error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateComplaintStatus(complaintId, newStatus, changedBy, notes = null) {
    try {
      // Update complaint status
      const { data: complaint, error: updateError } = await this.client
        .from('complaints')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', complaintId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Record status history
      const { error: historyError } = await this.client
        .from('complaint_status_history')
        .insert({
          complaint_id: complaintId,
          previous_status: complaint.status,
          new_status: newStatus,
          changed_by: changedBy,
          notes: notes
        });

      if (historyError) throw historyError;

      // Notify student of status change
      await this.createNotification(
        complaint.student_id,
        complaintId,
        'Complaint Status Updated',
        `Your complaint "${complaint.title}" status changed to: ${newStatus}`
      );

      return { success: true, data: complaint };
    } catch (error) {
      console.error('Update complaint status error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // NOTIFICATION METHODS
  // ========================================================================

  async createNotification(recipientId, complaintId, title, message) {
    try {
      const { data, error } = await this.client
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          complaint_id: complaintId,
          title: title,
          message: message
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create notification error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserNotifications(userId) {
    try {
      const { data, error } = await this.client
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get notifications error:', error);
      return { success: false, error: error.message };
    }
  }

  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await this.client
        .from('notifications')
        .update({ read_status: true })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Mark notification read error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // DEPARTMENT & STAFF METHODS
  // ========================================================================

  async getDepartments() {
    try {
      const { data, error } = await this.client
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get departments error:', error);
      return { success: false, error: error.message };
    }
  }

  async notifyDepartmentStaff(departmentName, complaint) {
    try {
      // Get all staff members in the department
      const { data: staffMembers, error } = await this.client
        .from('department_members')
        .select(`
          user_id,
          departments(name),
          profiles(name, role)
        `)
        .eq('departments.name', departmentName);

      if (error) throw error;

      // Create notifications for each staff member
      const notifications = staffMembers.map(member => ({
        recipient_id: member.user_id,
        complaint_id: complaint.id,
        title: 'New Complaint Assigned',
        message: `New ${complaint.urgency.toLowerCase()} priority complaint: "${complaint.title}" in ${complaint.block} Room ${complaint.room}`
      }));

      if (notifications.length > 0) {
        const { error: notifError } = await this.client
          .from('notifications')
          .insert(notifications);

        if (notifError) throw notifError;
      }

      return { success: true };
    } catch (error) {
      console.error('Notify department staff error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // AUDIT & ANALYTICS METHODS
  // ========================================================================

  async createAuditLog(actorId, action, relevantRecord, details) {
    try {
      const { error } = await this.client
        .from('audit_logs')
        .insert({
          actor_id: actorId,
          action: action,
          relevant_record: relevantRecord,
          details: details
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Create audit log error:', error);
      return { success: false };
    }
  }

  async getComplaintAnalytics() {
    try {
      const { data, error } = await this.client
        .from('complaints')
        .select('status, category, urgency, created_at, assigned_department');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get analytics error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // REAL-TIME SUBSCRIPTION METHODS
  // ========================================================================

  subscribeToComplaints(userId, callback) {
    return this.client
      .channel('complaints-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'complaints',
          filter: `student_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }

  subscribeToNotifications(userId, callback) {
    return this.client
      .channel('notifications-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }
}

// Export the API instance
window.supabaseAPI = new SupabaseAPI();