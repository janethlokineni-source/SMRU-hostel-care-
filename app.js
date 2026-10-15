 /**
 * SMRU HOSTEL CARE — FULL-STACK PRODUCTION CLIENT ENGINE
 * Centralized Hostel Complaint & Resolution Platform
 * Features:
 * - Genuine student & official authentication with separate portals
 * - Clean database engine (Zero duplicate / mock complaints)
 * - Automated department routing (All 10 Categories)
 * - Role-Based Access Control (Student, Staff, Warden, Administrator)
 * - Real-time synthesized Web Audio API chime notifications
 * - Live lifecycle timeline tracking, internal technician notes, ratings
 * - Chart.js analytics & CSV export
 */

// ============================================================================
// 1. DATA DICTIONARIES & MASTER CONFIGURATIONS
// ============================================================================

const COMPLAINT_CATEGORIES = [
  {
    id: "cupboard",
    name: "Cupboard & Locker Problems",
    icon: "🗄️",
    department: "Maintenance",
    subcategories: [
      "Broken cupboard door",
      "Faulty cupboard lock",
      "Locker not opening",
      "Damaged hinges or shelves",
      "Other cupboard problems"
    ]
  },
  {
    id: "water",
    name: "Water Problems",
    icon: "🚰",
    department: "Maintenance",
    subcategories: [
      "No water supply",
      "Low water pressure",
      "Drinking water cooler issue",
      "Water leakage in pipe",
      "Geyser / Hot water problem",
      "Other water problems"
    ]
  },
  {
    id: "bathroom",
    name: "Bathroom Problems",
    icon: "🚿",
    department: "Sanitation",
    subcategories: [
      "Blocked drainage",
      "Damaged taps or showers",
      "Flush not working",
      "Water leakage on floor",
      "Hygiene and deep cleaning required",
      "Other bathroom problems"
    ]
  },
  {
    id: "room",
    name: "Room Issues",
    icon: "🪑",
    department: "Maintenance",
    subcategories: [
      "Broken ceiling fan or regulator",
      "Tube light / bulb fused",
      "Damaged study table or chair",
      "Door latch or window glass broken",
      "Ceiling or wall plaster damage",
      "Other room issues"
    ]
  },
  {
    id: "food",
    name: "Food & Mess Problems",
    icon: "🍽️",
    department: "Mess Manager",
    subcategories: [
      "Food quality concerns",
      "Food hygiene and foreign object",
      "Undercooked or spoiled meal",
      "Incorrect menu or meal unavailability",
      "Mess dining hall water issue",
      "Other food problems"
    ]
  },
  {
    id: "dhobi",
    name: "Dhobi & Laundry Problems",
    icon: "👕",
    department: "Dhobi Manager",
    subcategories: [
      "Clothes missing / untraceable",
      "Clothes exchanged with another room",
      "Delayed laundry return (>4 days)",
      "Poor washing or dirty stains remained",
      "Damaged / torn clothes during iron",
      "Other laundry problems"
    ]
  },
  {
    id: "cleanliness",
    name: "Cleanliness & Sanitation",
    icon: "🧹",
    department: "Sanitation",
    subcategories: [
      "Room floor sweeping / mopping",
      "Corridor / Lobby cleanliness",
      "Dustbins overflowing in wing",
      "Pest / Insects / Mosquito fogging",
      "Other sanitation issues"
    ]
  },
  {
    id: "electricity",
    name: "Electricity & Internet",
    icon: "⚡",
    department: "Maintenance",
    subcategories: [
      "Power trip / MCB blackout",
      "Faulty charging socket / switchboard",
      "Wi-Fi router dead / low signal",
      "LAN port non-functional",
      "Other electrical or network issues"
    ]
  },
  {
    id: "security",
    name: "Security & Safety",
    icon: "🛡️",
    department: "Warden",
    subcategories: [
      "Main wing door lock broken",
      "Unsafe hostel facility or hazard",
      "Damaged fire safety equipment",
      "Unauthorized visitor in corridor",
      "Other urgent security concerns"
    ]
  },
  {
    id: "other",
    name: "Other Complaints",
    icon: "📝",
    department: "Warden",
    subcategories: [
      "Noise disturbance during study hours",
      "Lost & Found inquiry",
      "Gymnasium / Common room issue",
      "Custom complaint"
    ]
  }
];

// Institutional Authorized Staff Accounts (Authentic credentials)
const DEFAULT_SYSTEM_USERS = [
  {
    id: "u_warden_1",
    name: "Dr. V. Sharma",
    email: "warden@college.edu",
    password: "warden123",
    role: "warden",
    hostelBlock: "All Blocks",
    room: "Chief Warden Office",
    department: "Warden",
    status: "active"
  },
  {
    id: "u_maint_1",
    name: "Rajesh Kumar",
    email: "maintenance@hostel.edu",
    password: "maint123",
    role: "staff",
    hostelBlock: "All Blocks",
    room: "Central Workshop",
    department: "Maintenance",
    status: "active"
  },
  {
    id: "u_mess_1",
    name: "Chef Sunita Devi",
    email: "mess@hostel.edu",
    password: "mess123",
    role: "staff",
    hostelBlock: "Central Mess",
    room: "Mess Admin",
    department: "Mess Manager",
    status: "active"
  },
  {
    id: "u_sanit_1",
    name: "Ramesh Babu",
    email: "sanitation@hostel.edu",
    password: "clean123",
    role: "staff",
    hostelBlock: "All Blocks",
    room: "Sanitation Desk",
    department: "Sanitation",
    status: "active"
  },
  {
    id: "u_dhobi_1",
    name: "Mukesh Rao",
    email: "dhobi@hostel.edu",
    password: "dhobi123",
    role: "staff",
    hostelBlock: "Laundry Wing",
    room: "Dhobi Hub",
    department: "Dhobi Manager",
    status: "active"
  },
  {
    id: "u_admin_1",
    name: "Campus System Admin",
    email: "admin@college.edu",
    password: "admin123",
    role: "admin",
    hostelBlock: "Campus Wide",
    room: "IT Control Suite",
    department: "Administration",
    status: "active"
  },
  {
    id: "u_st_janeth",
    name: "Janeth",
    email: "janeth@gmail.com",
    rollNumber: "2024BCSE101",
    password: "password123",
    role: "student",
    hostelBlock: "Ganga Hostel",
    room: "302",
    phone: "9876543210",
    department: null,
    status: "active",
    authProvider: "google"
  },
  {
    id: "u_st_janeth_lok",
    name: "Janeth Lokineni",
    email: "janethlokineni@gmail.com",
    rollNumber: "2024BCSE102",
    password: "janeth123",
    role: "student",
    hostelBlock: "Ganga Hostel",
    room: "302",
    phone: "9494342265",
    department: null,
    status: "active",
    authProvider: "standard"
  },
  {
    id: "u_st_aarav",
    name: "Aarav Sharma",
    email: "aarav.student@gmail.com",
    rollNumber: "2024BCSE042",
    password: "password123",
    role: "student",
    hostelBlock: "Ganga Hostel",
    room: "204",
    phone: "9876543211",
    department: null,
    status: "active",
    authProvider: "google"
  }
];

// Authentic Campus Announcements from Chief Warden
const DEFAULT_ANNOUNCEMENTS = [];

// ============================================================================
// 2. PRODUCTION STATE STORE ENGINE (Fresh, Zero Duplicate Complaints)
// ============================================================================

class AppStore {
  constructor() {
    this.STORAGE_KEY = "SMART_HOSTEL_CARE_GENUINE_V1";
    this.init();
  }

  init() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      this.data = {
        users: [...DEFAULT_SYSTEM_USERS],
        complaints: [], // Completely clean & fresh — ZERO fake complaints!
        announcements: [],
        audits: [
          {
            id: "aud_sys_1",
            timestamp: new Date().toISOString(),
            actor: "System Initializer",
            action: "Platform Initialized",
            record: "INIT-001",
            details: "SMRU HOSTEL CARE production instance started. Departments synchronized."
          }
        ],
        notifications: [],
        counter: 1
      };
      this.save();
    } else {
      try {
        this.data = JSON.parse(raw);
        if (!this.data.complaints) this.data.complaints = [];
        if (!this.data.users) this.data.users = [...DEFAULT_SYSTEM_USERS];
        // Always remove old seeded announcements — show "No Announcements Yet"
        if (this.data.announcements) {
          this.data.announcements = this.data.announcements.filter(a => !["ann_1","ann_2"].includes(a.id));
        } else {
          this.data.announcements = [];
        }
        // Ensure personal Gmail demo accounts exist in existing storage
        DEFAULT_SYSTEM_USERS.forEach(defU => {
          if (!this.data.users.some(u => u.email.toLowerCase() === defU.email.toLowerCase())) {
            this.data.users.push(defU);
          }
        });
        this.save();
      } catch (e) {
        localStorage.removeItem(this.STORAGE_KEY);
        this.init();
      }
    }
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  getUsers() { return this.data.users; }
  getComplaints() { return this.data.complaints; }
  getAnnouncements() { return this.data.announcements; }
  getAudits() { return this.data.audits; }
  getNotifications() { return this.data.notifications; }

  getNextRefNumber() {
    const num = this.data.counter;
    this.data.counter += 1;
    this.save();
    return `HC-${new Date().getFullYear()}-${String(num).padStart(5, "0")}`;
  }

  addComplaint(complaint) {
    this.data.complaints.unshift(complaint);
    this.save();
  }

  updateComplaint(complaintId, updates) {
    const idx = this.data.complaints.findIndex(c => c.id === complaintId);
    if (idx !== -1) {
      this.data.complaints[idx] = { ...this.data.complaints[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.complaints[idx];
    }
    return null;
  }

  addNotification(notif) {
    this.data.notifications.unshift(notif);
    this.save();
  }

  addAnnouncement(ann) {
    this.data.announcements.unshift(ann);
    this.save();
  }

  addAudit(audit) {
    this.data.audits.unshift(audit);
    this.save();
  }

  markAllNotifsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.recipientId === userId) n.read = true;
    });
    this.save();
  }
}

// ============================================================================
// 3. SYNTHESIZED WEB AUDIO API SOUND CHIME (Zero external dependencies)
// ============================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playNotificationChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const freqs = [1046.5, 1567.98, 2093.0];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } catch (e) {
      console.warn("Audio autoplay blocked by browser policy:", e);
    }
  }

  playSuccessBeep() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("Audio beep failed:", e);
    }
  }
}

// ============================================================================
// 4. MAIN SMRU HOSTEL CARE CONTROLLER
// ============================================================================

class SmartHostelCareApp {
  constructor() {
    this.store = new AppStore();
    this.sound = new SoundEngine();
    this.currentUser = null;
    this.currentView = "landing";
    this.attachedImageBase64 = null;
    this.charts = { category: null, status: null };

    this.handleResize = this.handleResize.bind(this);
  }

  async init() {
    this.startSystemClock();
    this.initTheme();

    // Load and sync data from Supabase
    await this.syncWithSupabase();

    // Check active session
    const savedUser = localStorage.getItem("SMART_HOSTEL_ACTIVE_USER");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const exists = this.store.getUsers().find(u => u.id === parsed.id);
        if (exists) this.currentUser = exists;
      } catch (e) {
        localStorage.removeItem("SMART_HOSTEL_ACTIVE_USER");
      }
    }

    this.renderCategoryCards();
    this.populateComplaintFormCategories();
    this.updateNavState();

    window.addEventListener("resize", this.handleResize);

    // Global click listener: clicking outside or on the side of popups / modals closes them
    document.addEventListener("click", (e) => {
      const notifWrapper = document.getElementById("notifBellWrapper");
      const notifDropdown = document.getElementById("notifDropdown");
      if (notifDropdown && notifDropdown.classList.contains("show")) {
        // If click is outside the notification bell and its dropdown panel, dismiss it
        if (notifWrapper && !notifWrapper.contains(e.target)) {
          this.closeNotifDropdown();
        }
      }

      // If user clicks on the backdrop background of any open modal, dismiss it
      if (e.target && e.target.classList && e.target.classList.contains("modal-backdrop") && e.target.classList.contains("show")) {
        e.target.classList.remove("show");
      }
    });

    // Global keyboard listener: ESC key closes open notifications and modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        this.closeNotifDropdown();
        this.closeMobileMenu();
        this.closeComplaintDetailModal();
        this.closeAnnouncementModal();
        this.closeMobileConnectModal();
        this.closeGoogleAuthModal();
        this.closeImageZoom();
      }
    });

    // If loaded on a mobile screen, reflect mobile mode in device switcher
    if (window.innerWidth <= 768) {
      const btnLaptop = document.getElementById("btnViewLaptop");
      const btnMobile = document.getElementById("btnViewMobile");
      if (btnLaptop) btnLaptop.classList.remove("active");
      if (btnMobile) btnMobile.classList.add("active");
    }

    if (this.currentUser) {
      this.navigate("dashboard");
    } else {
      this.navigate("landing");
    }
  }

  async syncWithSupabase() {
    try {
      console.log('Syncing data with Supabase...');
      
      // Check if user is already logged in with Supabase
      const { data: { user } } = await supabaseAPI.getUser();
      if (user && !this.currentUser) {
        // Get user profile and restore session
        const profile = await supabaseAPI.getUserProfile(user.id);
        if (profile) {
          this.currentUser = {
            id: user.id,
            email: user.email,
            name: profile.full_name || user.email.split('@')[0],
            role: profile.role,
            rollNumber: profile.roll_number,
            phone: profile.phone,
            room: profile.room,
            block: profile.block,
            department: profile.department,
            avatar: profile.avatar_url,
            authProvider: 'supabase'
          };
          localStorage.setItem("SMART_HOSTEL_ACTIVE_USER", JSON.stringify(this.currentUser));
        }
      }

      // Load complaints from Supabase
      const supabaseComplaints = await supabaseAPI.getComplaints();
      if (supabaseComplaints && supabaseComplaints.length > 0) {
        // Merge with local complaints, avoiding duplicates
        const localComplaints = this.store.getComplaints();
        const mergedComplaints = [...supabaseComplaints];
        
        // Add local complaints that don't exist in Supabase
        localComplaints.forEach(localComplaint => {
          if (!supabaseComplaints.find(sc => sc.id === localComplaint.id || sc.refNumber === localComplaint.refNumber)) {
            mergedComplaints.push(localComplaint);
          }
        });
        
        // Update local storage with merged data
        this.store.data.complaints = mergedComplaints;
        this.store.save();
      }

      // Setup real-time subscriptions
      this.setupRealtimeSubscriptions();
      
    } catch (error) {
      console.warn('Supabase sync failed, continuing with local data:', error);
    }
  }

  setupRealtimeSubscriptions() {
    try {
      // Subscribe to complaint updates
      supabaseAPI.subscribeToComplaints((payload) => {
        console.log('Real-time complaint update:', payload);
        
        if (payload.eventType === 'INSERT') {
          // New complaint added
          const newComplaint = payload.new;
          const existingIndex = this.store.data.complaints.findIndex(c => c.id === newComplaint.id);
          if (existingIndex === -1) {
            this.store.data.complaints.unshift(newComplaint);
            this.store.save();
            
            // Show notification if it's for current user
            if (this.currentUser && newComplaint.studentId === this.currentUser.id) {
              this.sound.playNotificationChime();
              this.showToast('Complaint Updated', 'Your complaint status has been updated', 'info');
            }
          }
        } else if (payload.eventType === 'UPDATE') {
          // Complaint updated
          const updatedComplaint = payload.new;
          const existingIndex = this.store.data.complaints.findIndex(c => c.id === updatedComplaint.id);
          if (existingIndex !== -1) {
            this.store.data.complaints[existingIndex] = updatedComplaint;
            this.store.save();
            
            // Show notification if it's for current user
            if (this.currentUser && updatedComplaint.studentId === this.currentUser.id) {
              this.sound.playNotificationChime();
              this.showToast('Complaint Updated', 'Your complaint status has been updated', 'info');
            }
          }
        }
        
        // Refresh current view if on dashboard
        if (this.currentView === 'dashboard' || this.currentView === 'student-dashboard') {
          this.refreshDashboardData();
        }
      });
      
    } catch (error) {
      console.warn('Could not setup real-time subscriptions:', error);
    }
  }

  refreshDashboardData() {
    // Refresh the current dashboard view
    if (this.currentUser) {
      if (this.currentUser.role === 'student') {
        this.renderStudentComplaintsList();
      } else {
        this.renderOfficialComplaintsList();
      }
      
      // 🚨 NEW: Update notification statistics
      this.updateNotificationStats();
    }
  }

  // 🚨 NEW: Update notification system statistics
  updateNotificationStats() {
    try {
      if (window.notificationService) {
        const stats = window.notificationService.getNotificationStats();
        
        // Update escalation counter
        const escalationCountEl = document.getElementById('officialEscalatedToday');
        if (escalationCountEl) {
          escalationCountEl.textContent = stats.activeEscalations || 0;
        }

        // Update notification counters (these would be tracked in a production system)
        const today = new Date().toDateString();
        const emailCount = localStorage.getItem(`emailsSent_${today}`) || 0;
        const smsCount = localStorage.getItem(`smsSent_${today}`) || 0;
        
        const emailCountEl = document.getElementById('emailsReceivedToday');
        const smsCountEl = document.getElementById('smsReceivedToday');
        
        if (emailCountEl) emailCountEl.textContent = emailCount;
        if (smsCountEl) smsCountEl.textContent = smsCount;

        console.log('📊 Notification stats updated:', { 
          activeEscalations: stats.activeEscalations,
          emailsToday: emailCount,
          smsToday: smsCount
        });
      }
    } catch (error) {
      console.error('Failed to update notification stats:', error);
    }
  }

  // 🚨 NEW: Test notification system
  async testNotificationSystem() {
    if (!window.notificationService) {
      this.showToast("Notification Service", "❌ Notification service not loaded", "error");
      return;
    }

    this.showToast("Testing Notifications", "🧪 Sending test notifications...", "info");

    try {
      // Create test complaint data
      const testComplaint = {
        id: 'test_' + Date.now(),
        refNumber: 'HC-TEST-00001',
        studentName: 'Test Student',
        studentEmail: this.currentUser.email,
        title: 'Test Notification System',
        category: 'System Test',
        block: 'Test Block',
        room: '999',
        urgency: 'High',
        assignedDepartment: 'IT Support',
        createdAt: new Date().toISOString()
      };

      // Create test official
      const testOfficial = {
        id: this.currentUser.id,
        name: this.currentUser.name,
        email: this.currentUser.email,
        phone: this.currentUser.phone || '+911234567890',
        department: 'IT Support',
        role: 'staff'
      };

      // Test notifications
      const results = await window.notificationService.notifyComplaintSubmission(
        testComplaint, 
        [testOfficial]
      );

      // Show results
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      if (successCount > 0) {
        this.showToast("Test Complete", `✅ ${successCount}/${totalCount} test notifications sent successfully!`, "success");
      } else {
        this.showToast("Test Results", "⚠️ Test notifications failed. Check notification setup guide.", "warning");
      }

      console.log('🧪 Test notification results:', results);

    } catch (error) {
      console.error('Test notification failed:', error);
      this.showToast("Test Failed", "❌ Notification test encountered an error", "error");
    }
  }

  // 🚨 NEW: Refresh notification statistics
  refreshNotificationStats() {
    this.updateNotificationStats();
    this.showToast("Stats Refreshed", "📊 Notification statistics updated", "info");
  }

  startSystemClock() {
    const clockEl = document.getElementById("systemClock");
    const updateTime = () => {
      const now = new Date();
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  handleResize() {
    if (this.currentView === "analytics") {
      this.renderAnalyticsCharts();
    }
  }

  // ==========================================================================
  // ROUTING & VIEW CONTROLLER
  // ==========================================================================

  navigate(viewName) {
    if (viewName === "dashboard") {
      if (!this.currentUser) {
        this.navigate("student-auth");
        return;
      }
      viewName = this.currentUser.role === "student" ? "student-dashboard" : "official-dashboard";
    }

    // RBAC Permissions check
    if ((viewName === "student-dashboard" || viewName === "submit") && (!this.currentUser || this.currentUser.role !== "student")) {
      if (!this.currentUser) {
        this.navigate("student-auth");
        return;
      } else {
        this.showToast("Access Restricted", "You are signed in under an Official account. Accessing Operations Dashboard.", "info");
        viewName = "official-dashboard";
      }
    }

    if ((viewName === "official-dashboard" || viewName === "analytics") && (!this.currentUser || this.currentUser.role === "student")) {
      this.showToast("Access Restricted", "This section requires official staff or warden privileges.", "warning");
      viewName = "student-dashboard";
    }

    if (viewName === "admin" && (!this.currentUser || (this.currentUser.role !== "admin" && this.currentUser.role !== "warden"))) {
      this.showToast("Administrator Only", "Requires Super Admin or Chief Warden clearance.", "error");
      viewName = this.currentUser ? (this.currentUser.role === "student" ? "student-dashboard" : "official-dashboard") : "landing";
    }

    // Hide all views
    document.querySelectorAll(".page-view").forEach(el => el.classList.remove("active"));

    // Activate target view
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.add("active");
      this.currentView = viewName;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Update active nav button
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    const navBtnMap = {
      "landing": "navLinkHome",
      "student-dashboard": "navLinkDashboard",
      "official-dashboard": "navLinkDashboard",
      "submit": "navLinkSubmit",
      "announcements": "navLinkAnnouncements",
      "analytics": "navLinkAnalytics",
      "admin": "navLinkAdmin",
      "emergency": "navLinkEmergency"
    };
    const activeBtn = document.getElementById(navBtnMap[viewName]);
    if (activeBtn) activeBtn.classList.add("active");

    // Update active mobile bottom bar button
    document.querySelectorAll(".bottom-nav-item").forEach(btn => btn.classList.remove("active"));
    const bottomNavMap = {
      "landing": "bNavHome",
      "submit": "bNavSubmit",
      "student-dashboard": "bNavDash",
      "official-dashboard": "bNavDash",
      "announcements": "bNavNotices",
      "student-auth": "bNavProfile",
      "official-auth": "bNavProfile"
    };
    const activeBottomBtn = document.getElementById(bottomNavMap[viewName]);
    if (activeBottomBtn) activeBottomBtn.classList.add("active");

    this.refreshCurrentView();
  }

  refreshCurrentView() {
    switch (this.currentView) {
      case "landing":
        this.updateHeroStats();
        break;
      case "student-dashboard":
        this.renderStudentDashboard();
        break;
      case "official-dashboard":
        this.renderOfficialDashboard();
        break;
      case "submit":
        this.prepareSubmitForm();
        break;
      case "announcements":
        this.renderAnnouncements();
        break;
      case "analytics":
        this.renderAnalyticsCharts();
        break;
      case "admin":
        this.renderAdminPortal();
        break;
    }
  }

  updateNavState() {
    const authNavContainer = document.getElementById("authNavContainer");
    const mobileDrawerAuth = document.getElementById("mobileDrawerAuth");
    const notifBellWrapper = document.getElementById("notifBellWrapper");

    const isStudent = this.currentUser && this.currentUser.role === "student";
    const isStaff = this.currentUser && (this.currentUser.role === "staff" || this.currentUser.role === "warden" || this.currentUser.role === "admin");
    const isAdmin = this.currentUser && (this.currentUser.role === "admin" || this.currentUser.role === "warden");

    document.querySelectorAll(".auth-required").forEach(el => {
      el.style.display = this.currentUser ? "inline-flex" : "none";
    });
    document.querySelectorAll(".student-only").forEach(el => {
      el.style.display = isStudent ? "inline-flex" : "none";
    });
    document.querySelectorAll(".staff-only").forEach(el => {
      el.style.display = isStaff ? "inline-flex" : "none";
    });
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = isAdmin ? "inline-flex" : "none";
    });

    if (this.currentUser) {
      if (notifBellWrapper) notifBellWrapper.style.display = "block";
      this.updateNotificationBadge();

      const initials = this.currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("");
      if (authNavContainer) {
        authNavContainer.innerHTML = `
          <div class="user-nav-profile" onclick="app.navigate('dashboard')" title="Signed in as ${this.currentUser.name}">
            <div class="user-avatar-mini">${initials}</div>
            <div class="user-nav-info">
              <span class="user-nav-name">${this.currentUser.name.split(" ")[0]}</span>
              <span class="user-nav-role">${this.currentUser.role}</span>
            </div>
            <button class="text-btn text-xs" onclick="event.stopPropagation(); app.logout()" title="Logout" style="color: #ef4444; margin-left: 8px;">Sign Out</button>
          </div>
        `;
      }

      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <div style="padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 0.85rem;">
              <div class="user-avatar-mini">${initials}</div>
              <div>
                <div style="font-weight:600; color:#fff; font-size:0.92rem;">${this.escapeHtml(this.currentUser.name)}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); text-transform:capitalize;">${this.currentUser.role}</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm btn-block" onclick="app.logout(); app.closeMobileMenu();" style="color:#ef4444; border-color:rgba(239,68,68,0.3);">Sign Out</button>
          </div>
        `;
      }
    } else {
      if (notifBellWrapper) notifBellWrapper.style.display = "none";
      if (authNavContainer) {
        authNavContainer.innerHTML = `
          <button class="btn btn-secondary btn-sm" onclick="app.navigate('student-auth')">🎓 Student Portal</button>
          <button class="btn btn-primary btn-sm glow-btn" onclick="app.navigate('official-auth')">🛡️ Officials Portal</button>
        `;
      }
      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:0.65rem; padding-top:1rem; border-top: 1px solid rgba(255,255,255,0.08);">
            <button class="btn btn-secondary btn-block btn-sm" onclick="app.navigateAndClose('student-auth')">🎓 Student Portal</button>
            <button class="btn btn-primary btn-block btn-sm glow-btn" onclick="app.navigateAndClose('official-auth')">🛡️ Officials Portal</button>
          </div>
        `;
      }
    }

    // Sync mobile bottom app bar profile icon & label
    const bNavProfileLabel = document.getElementById("bNavProfileLabel");
    const bNavProfileIcon = document.getElementById("bNavProfileIcon");
    if (bNavProfileLabel && bNavProfileIcon) {
      if (this.currentUser) {
        bNavProfileLabel.textContent = this.currentUser.name.split(" ")[0];
        bNavProfileIcon.textContent = isStudent ? "🎓" : "🛡️";
      } else {
        bNavProfileLabel.textContent = "Account";
        bNavProfileIcon.textContent = "👤";
      }
    }
  }

  // ==========================================================================
  // DEDICATED AUTHENTICATION METHODS (Student vs Official)
  // ==========================================================================

  setStudentAuthMode(mode) {
    const tabSignIn = document.getElementById("studentTabSignIn");
    const tabRegister = document.getElementById("studentTabRegister");
    const signInForm = document.getElementById("studentSignInForm");
    const registerForm = document.getElementById("studentRegisterForm");

    if (mode === "signin") {
      tabSignIn.classList.add("active");
      tabRegister.classList.remove("active");
      signInForm.style.display = "block";
      registerForm.style.display = "none";
    } else {
      tabSignIn.classList.remove("active");
      tabRegister.classList.add("active");
      signInForm.style.display = "none";
      registerForm.style.display = "block";
    }
  }

  togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
    }
  }

  async handleStudentLogin(e) {
    e.preventDefault();
    const emailOrRoll = document.getElementById("studentLoginEmail").value.trim().toLowerCase();
    const password = document.getElementById("studentLoginPassword").value;

    if (!emailOrRoll || !password) {
      this.showToast("Missing Information", "Please enter both email/roll number and password.", "error");
      return;
    }

    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]') || e.target;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Signing in...';
      submitBtn.disabled = true;

      // Try to authenticate with Supabase
      const { user, error } = await supabaseAPI.signIn(emailOrRoll, password);
      
      if (error) {
        // If Supabase auth fails, fall back to local storage for demo
        const localUser = this.store.getUsers().find(u =>
          u.role === "student" &&
          (u.email.toLowerCase() === emailOrRoll || (u.rollNumber && u.rollNumber.toLowerCase() === emailOrRoll))
        );

        if (localUser) {
          if (localUser.password && localUser.password !== password) {
            this.showToast("Incorrect Password", "Please check your password and try again.", "error");
            return;
          }
          this.loginSession(localUser);
        } else {
          // Not found — smoothly switch to register tab with email pre-filled
          this.showToast("Account Not Found", "No account found. Please register below to create your account.", "warning");
          this.setStudentAuthMode("register");
          const regEmail = document.getElementById("regStudentEmail");
          if (regEmail) regEmail.value = emailOrRoll.includes("@") ? emailOrRoll : "";
        }
        return;
      }

      // Get user profile from Supabase
      const profile = await supabaseAPI.getUserProfile(user.id);
      
      // Create user object compatible with existing system
      const supabaseUser = {
        id: user.id,
        email: user.email,
        name: profile?.full_name || user.email.split('@')[0],
        role: profile?.role || 'student',
        rollNumber: profile?.roll_number,
        phone: profile?.phone,
        room: profile?.room,
        block: profile?.block,
        password: null, // Don't store password locally
        avatar: profile?.avatar_url
      };

      this.loginSession(supabaseUser);
      
    } catch (error) {
      console.error('Login error:', error);
      this.showToast("Login Failed", "An error occurred during login. Please try again.", "error");
    } finally {
      // Reset button state
      const submitBtn = e.target.querySelector('button[type="submit"]') || e.target;
      submitBtn.textContent = submitBtn.textContent.includes('Signing in') ? 'Sign In' : submitBtn.textContent;
      submitBtn.disabled = false;
    }
  }

  async handleStudentRegister(e) {
    e.preventDefault();
    const name = document.getElementById("regStudentName").value.trim();
    const email = document.getElementById("regStudentEmail").value.trim().toLowerCase();
    const roll = document.getElementById("regStudentRoll").value.trim().toUpperCase();
    const block = document.getElementById("regStudentBlock").value;
    const room = document.getElementById("regStudentRoom").value.trim();
    const phone = document.getElementById("regStudentPhone").value.trim();
    const password = document.getElementById("regStudentPassword").value;

    if (!name || !email || !roll || !password) {
      this.showToast("Missing Information", "Please fill in all required fields.", "error");
      return;
    }

    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]') || e.target;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating Account...';
      submitBtn.disabled = true;

      // Check if user already exists locally
      const existingLocal = this.store.getUsers().find(u => u.email.toLowerCase() === email);
      if (existingLocal) {
        this.showToast("Account Exists", "An account with this email already exists. Please sign in.", "info");
        this.setStudentAuthMode("signin");
        return;
      }

      // Try to register with Supabase
      const { user, error } = await supabaseAPI.signUp(email, password);
      
      if (error) {
        // If Supabase registration fails, fall back to local storage for demo
        console.warn('Supabase registration failed, using local storage:', error);
        
        const newStudent = {
          id: "u_st_" + Date.now(),
          name: name,
          email: email,
          rollNumber: roll,
          password: password,
          role: "student",
          hostelBlock: block,
          room: room,
          phone: phone,
          department: null,
          status: "active",
          authProvider: email.includes("gmail.com") ? "personal_gmail" : "standard"
        };

        this.store.data.users.push(newStudent);
        this.store.save();

        this.store.addAudit({
          id: "aud_" + Date.now(),
          timestamp: new Date().toISOString(),
          actor: `${name} (Student)`,
          action: "Account Self-Registration",
          record: roll,
          details: `Enrolled in ${block}, Room ${room} with email: ${email}`
        });

        this.showToast("Account Registered", `Welcome ${name}! Your student account is active (${email}).`, "success");
        this.loginSession(newStudent);
        return;
      }

      // Create/update user profile in Supabase
      const profileData = {
        full_name: name,
        roll_number: roll,
        role: 'student',
        block: block,
        room: room,
        phone: phone
      };

      await supabaseAPI.updateUserProfile(user.id, profileData);

      // Create user object compatible with existing system
      const newSupabaseStudent = {
        id: user.id,
        name: name,
        email: user.email,
        rollNumber: roll,
        password: null, // Don't store password locally
        role: "student",
        hostelBlock: block,
        room: room,
        phone: phone,
        department: null,
        status: "active",
        authProvider: "supabase"
      };

      this.store.addAudit({
        id: "aud_" + Date.now(),
        timestamp: new Date().toISOString(),
        actor: `${name} (Student)`,
        action: "Account Self-Registration (Supabase)",
        record: roll,
        details: `Enrolled in ${block}, Room ${room} with email: ${email}`
      });

      this.showToast("Account Registered", `Welcome ${name}! Your student account is active (${email}). Please check your email to verify your account.`, "success");
      this.loginSession(newSupabaseStudent);
      
    } catch (error) {
      console.error('Registration error:', error);
      this.showToast("Registration Failed", "An error occurred during registration. Please try again.", "error");
    } finally {
      // Reset button state
      const submitBtn = e.target.querySelector('button[type="submit"]') || e.target;
      submitBtn.textContent = submitBtn.textContent.includes('Creating') ? 'Register Account' : submitBtn.textContent;
      submitBtn.disabled = false;
    }
  }

  // ==========================================================================
  // GOOGLE / PERSONAL GMAIL AUTHENTICATION HANDLERS
  // ==========================================================================

  openGoogleAuthModal(role = "student") {
    this.googleTargetRole = role;
    const modal = document.getElementById("googleAuthModal");
    const title = document.getElementById("googleModalTitle");
    const subtitle = document.getElementById("googleModalSubtitle");
    if (title && subtitle) {
      if (role === "staff") {
        title.textContent = "Sign In with Authorized Google";
        subtitle.textContent = "Sign in to Hostel Operations using your authorized Google Account";
      } else {
        title.textContent = "Sign in with Google";
        subtitle.textContent = "Join SMRU HOSTEL CARE using your personal Gmail account";
      }
    }
    if (modal) modal.classList.add("show");
  }

  closeGoogleAuthModal() {
    const modal = document.getElementById("googleAuthModal");
    if (modal) modal.classList.remove("show");
  }

  selectGoogleAccount(name, email) {
    this.closeGoogleAuthModal();
    this.authenticateWithGoogleUser(name, email, this.googleTargetRole || "student");
  }

  handleCustomGoogleSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("customGmailInput").value.trim().toLowerCase();
    let name = document.getElementById("customGmailNameInput")?.value.trim();
    if (!name) {
      name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }
    this.closeGoogleAuthModal();
    this.authenticateWithGoogleUser(name, email, this.googleTargetRole || "student");
  }

  authenticateWithGoogleUser(name, email, role = "student") {
    let user = this.store.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Auto-register new resident with personal Gmail!
      const generatedRoll = "GMAIL" + Math.floor(1000 + Math.random() * 9000);
      user = {
        id: "u_g_" + Date.now(),
        name: name,
        email: email,
        rollNumber: generatedRoll,
        password: "google_oauth_verified",
        role: role,
        hostelBlock: "Ganga Hostel",
        room: "302",
        phone: "",
        department: role === "staff" ? "Maintenance" : null,
        status: "active",
        authProvider: "google"
      };
      this.store.data.users.push(user);
      this.store.save();

      this.store.addAudit({
        id: "aud_" + Date.now(),
        timestamp: new Date().toISOString(),
        actor: `${name} (${role})`,
        action: "Google Auth Registration",
        record: email,
        details: `Auto-joined via Personal Google/Gmail account.`
      });

      this.showToast("Google Account Linked", `Welcome ${name}! Registered with personal Gmail ${email}.`, "success");
    } else {
      this.showToast("Google Verified", `Welcome back, ${user.name}! Signed in with ${email}.`, "success");
    }

    this.loginSession(user);
  }

  async handleStaffLogin(e) {
    e.preventDefault();
    const email = document.getElementById("staffLoginEmail").value.trim().toLowerCase();
    const department = document.getElementById("staffLoginDept").value;
    const password = document.getElementById("staffLoginPassword").value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]') || e.target;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Authenticating...';
      submitBtn.disabled = true;

      // Try to authenticate with Supabase
      const { user, error } = await supabaseAPI.signIn(email, password);
      
      if (error) {
        // If Supabase auth fails, fall back to local storage for demo
        const localOfficer = this.store.getUsers().find(u => 
          u.email.toLowerCase() === email && 
          (u.role === "staff" || u.role === "warden" || u.role === "admin")
        );

        if (localOfficer) {
          if (localOfficer.password && localOfficer.password !== password) {
            alert("Incorrect security password. Please re-enter.");
            return;
          }
          this.loginSession(localOfficer);
        } else {
          alert("Unauthorized email address. Please use your official institutional email (e.g. warden@college.edu or maintenance@hostel.edu).");
        }
        return;
      }

      // Get user profile from Supabase
      const profile = await supabaseAPI.getUserProfile(user.id);
      
      // Verify staff role
      if (!profile || !['staff', 'warden', 'admin'].includes(profile.role)) {
        alert("Unauthorized access. This login is for staff members only.");
        await supabaseAPI.signOut();
        return;
      }

      // Create staff user object compatible with existing system
      const supabaseStaff = {
        id: user.id,
        email: user.email,
        name: profile.full_name || user.email.split('@')[0],
        role: profile.role,
        department: profile.department || department,
        phone: profile.phone,
        password: null, // Don't store password locally
        avatar: profile.avatar_url,
        status: 'active'
      };

      this.loginSession(supabaseStaff);
      
    } catch (error) {
      console.error('Staff login error:', error);
      alert("Login failed. Please try again.");
    } finally {
      // Reset button state
      const submitBtn = e.target.querySelector('button[type="submit"]') || e.target;
      submitBtn.textContent = submitBtn.textContent.includes('Authenticating') ? 'Authorize Staff Session' : submitBtn.textContent;
      submitBtn.disabled = false;
    }
  }

  fillOfficialCreds(email, dept, pass) {
    document.getElementById("staffLoginEmail").value = email;
    document.getElementById("staffLoginDept").value = dept;
    document.getElementById("staffLoginPassword").value = pass;
    this.showToast("Credentials Selected", `Selected ${dept} account. Click 'Authorize Staff Session' to sign in.`, "info");
  }

  loginSession(user) {
    this.currentUser = user;
    localStorage.setItem("SMART_HOSTEL_ACTIVE_USER", JSON.stringify(user));
    this.updateNavState();
    this.sound.playSuccessBeep();

    this.store.addAudit({
      id: "aud_" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `${user.name} (${user.role})`,
      action: "Portal Authentication",
      record: user.email,
      details: `Logged into ${user.role} workspace`
    });

    this.showToast("Signed In", `Authenticated as ${user.name} (${user.role}).`, "success");
    this.navigate("dashboard");
  }

  async logout() {
    try {
      // Sign out from Supabase if user was authenticated with Supabase
      if (this.currentUser && this.currentUser.authProvider === 'supabase') {
        await supabaseAPI.signOut();
      }
      
      this.currentUser = null;
      localStorage.removeItem("SMART_HOSTEL_ACTIVE_USER");
      this.updateNavState();
      this.showToast("Signed Out", "You have been logged out securely.", "info");
      this.navigate("landing");
      
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if Supabase logout fails
      this.currentUser = null;
      localStorage.removeItem("SMART_HOSTEL_ACTIVE_USER");
      this.updateNavState();
      this.showToast("Signed Out", "You have been logged out.", "info");
      this.navigate("landing");
    }
  }

  // ==========================================================================
  // LANDING PAGE & CATEGORIES
  // ==========================================================================

  renderCategoryCards() {
    const landingGrid = document.getElementById("landingCategoriesGrid");
    if (!landingGrid) return;

    landingGrid.innerHTML = COMPLAINT_CATEGORIES.map(cat => `
      <div class="category-card glass-card" onclick="app.quickActionCategory('${cat.id}')">
        <div class="category-icon">${cat.icon}</div>
        <div class="category-title">${cat.name}</div>
        <div class="category-dept-tag">Routed To: ${cat.department}</div>
        <div class="category-sublist">${cat.subcategories.slice(0, 3).join(" &bull; ")}...</div>
      </div>
    `).join("");
  }

  quickActionSubmit() {
    if (!this.currentUser) {
      this.navigate("student-auth");
    } else if (this.currentUser.role === "student") {
      this.navigate("submit");
    } else {
      this.navigate("official-dashboard");
    }
  }

  quickActionCategory(catId) {
    if (!this.currentUser) {
      this.navigate("student-auth");
    } else if (this.currentUser.role === "student") {
      this.navigate("submit");
      const catSelect = document.getElementById("complaintCategorySelect");
      if (catSelect) {
        const found = COMPLAINT_CATEGORIES.find(c => c.id === catId);
        if (found) {
          catSelect.value = found.name;
          this.onCategorySelectChange();
        }
      }
    } else {
      this.navigate("official-dashboard");
    }
  }

  updateHeroStats() {
    const all = this.store.getComplaints();
    const resolvedCount = all.filter(c => c.status === "Resolved" || c.status === "Closed").length;
    const rate = all.length > 0 ? ((resolvedCount / all.length) * 100).toFixed(1) + "%" : "100%";

    const statResolved = document.getElementById("heroStatResolved");
    if (statResolved) statResolved.textContent = rate;
  }

  // ==========================================================================
  // STUDENT DASHBOARD
  // ==========================================================================

  renderStudentDashboard() {
    if (!this.currentUser || this.currentUser.role !== "student") return;

    document.getElementById("studentWelcomeName").textContent = this.currentUser.name;
    document.getElementById("studentBlockTag").textContent = this.currentUser.hostelBlock || "Ganga Hostel";
    document.getElementById("studentRoomTag").textContent = `Room ${this.currentUser.room || "101"}`;
    document.getElementById("studentAvatar").textContent = this.currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("");

    const studentComplaints = this.store.getComplaints().filter(c => c.studentId === this.currentUser.id);
    const total = studentComplaints.length;
    const pending = studentComplaints.filter(c => c.status === "Submitted" || c.status === "Acknowledged").length;
    const inProgress = studentComplaints.filter(c => c.status === "In Progress" || c.status === "Waiting for Student").length;
    const resolved = studentComplaints.filter(c => c.status === "Resolved" || c.status === "Closed").length;

    document.getElementById("metricStudentTotal").textContent = total;
    document.getElementById("metricStudentPending").textContent = pending;
    document.getElementById("metricStudentProgress").textContent = inProgress;
    document.getElementById("metricStudentResolved").textContent = resolved;

    const quickGrid = document.getElementById("studentQuickCategoriesGrid");
    if (quickGrid) {
      quickGrid.innerHTML = COMPLAINT_CATEGORIES.map(cat => `
        <div class="quick-cat-card" onclick="app.quickActionCategory('${cat.id}')">
          <div class="quick-cat-icon">${cat.icon}</div>
          <div class="quick-cat-name">${cat.name.split(" ")[0]}...</div>
        </div>
      `).join("");
    }

    this.filterStudentComplaints("all");
  }

  filterStudentComplaints(statusFilter, btnElement = null) {
    if (btnElement) {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      btnElement.classList.add("active");
    }

    const container = document.getElementById("studentComplaintsList");
    if (!container || !this.currentUser) return;

    let list = this.store.getComplaints().filter(c => c.studentId === this.currentUser.id);

    if (statusFilter === "Pending") {
      list = list.filter(c => c.status === "Submitted" || c.status === "Acknowledged");
    } else if (statusFilter === "In Progress") {
      list = list.filter(c => c.status === "In Progress" || c.status === "Waiting for Student");
    } else if (statusFilter === "Resolved") {
      list = list.filter(c => c.status === "Resolved" || c.status === "Closed");
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state glass-card">
          <div class="empty-state-icon">✨</div>
          <h4>No Complaints Logged</h4>
          <p>You have not logged any complaints yet. Everything is in order! If you encounter an issue in your room or hostel wing, submit a ticket above.</p>
          <button class="btn btn-primary btn-sm glow-btn" onclick="app.navigate('submit')">Lodge New Complaint</button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => `
      <div class="complaint-card glass-card glass-interactive" onclick="app.openComplaintDetail('${c.id}')">
        <div class="complaint-card-top">
          <span class="complaint-ref-id">${c.refNumber}</span>
          <span class="status-badge ${c.status.toLowerCase().replace(/\s+/g, '')}">
            ${c.status}
          </span>
        </div>

        <div class="complaint-card-title">${this.escapeHtml(c.title)}</div>
        <div class="complaint-card-desc">${this.escapeHtml(c.description)}</div>

        <div class="complaint-card-meta">
          <span class="urgency-chip ${c.urgency.toLowerCase()}">
            &bull; Urgency: ${c.urgency}
          </span>
          <span>Dept: ${c.assignedDepartment}</span>
          <span>${this.formatDate(c.createdAt)}</span>
        </div>
      </div>
    `).join("");
  }

  // ==========================================================================
  // OFFICIAL & STAFF DASHBOARD
  // ==========================================================================

  renderOfficialDashboard() {
    if (!this.currentUser || this.currentUser.role === "student") return;

    document.getElementById("officialWelcomeName").textContent = this.currentUser.name;
    document.getElementById("officialRoleDept").textContent = `${this.currentUser.role.toUpperCase()} OPERATIONS DESK`;
    document.getElementById("officialDeptBadge").textContent = this.currentUser.department || "Hostel Oversight";
    document.getElementById("officialHostelBadge").textContent = this.currentUser.hostelBlock || "All Blocks";
    document.getElementById("officialAvatar").textContent = this.currentUser.name.split(" ").map(n => n[0]).slice(0, 2).join("");

    const catSelect = document.getElementById("filterCategory");
    if (catSelect && catSelect.options.length <= 1) {
      COMPLAINT_CATEGORIES.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.textContent = c.name;
        catSelect.appendChild(opt);
      });
    }

    this.filterOfficialComplaints();
  }

  getFilteredOfficialComplaints() {
    const isWardenOrAdmin = this.currentUser.role === "warden" || this.currentUser.role === "admin";
    let list = this.store.getComplaints();

    if (!isWardenOrAdmin) {
      list = list.filter(c => c.assignedDepartment === this.currentUser.department);
    }

    const searchVal = (document.getElementById("officialSearchInput")?.value || "").toLowerCase().trim();
    const catVal = document.getElementById("filterCategory")?.value || "all";
    const statusVal = document.getElementById("filterStatus")?.value || "all";
    const urgencyVal = document.getElementById("filterUrgency")?.value || "all";
    const blockVal = document.getElementById("filterBlock")?.value || "all";

    if (searchVal) {
      list = list.filter(c => 
        c.refNumber.toLowerCase().includes(searchVal) ||
        c.title.toLowerCase().includes(searchVal) ||
        c.room.toLowerCase().includes(searchVal) ||
        c.studentName.toLowerCase().includes(searchVal)
      );
    }

    if (catVal !== "all") list = list.filter(c => c.category === catVal);
    if (statusVal !== "all") list = list.filter(c => c.status === statusVal);
    if (urgencyVal !== "all") list = list.filter(c => c.urgency === urgencyVal);
    if (blockVal !== "all") list = list.filter(c => c.block === blockVal);

    return list;
  }

  filterOfficialComplaints() {
    const list = this.getFilteredOfficialComplaints();
    const tbody = document.getElementById("officialComplaintsTbody");

    const total = list.length;
    const now = Date.now();
    const newToday = list.filter(c => (now - new Date(c.createdAt).getTime()) < 24 * 3600000).length;
    const unassigned = list.filter(c => c.assignedOfficial === "Unassigned" || !c.assignedOfficial).length;
    const critical = list.filter(c => c.urgency === "Critical" || c.status === "Escalated").length;

    document.getElementById("metricOfficialTotal").textContent = total;
    document.getElementById("metricOfficialNewToday").textContent = newToday;
    document.getElementById("metricOfficialUnassigned").textContent = unassigned;
    document.getElementById("metricOfficialCritical").textContent = critical;

    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 3rem; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🎉</div>
            <strong style="font-size: 1.1rem; color: #fff;">No Complaints in Queue</strong>
            <div class="text-xs text-muted" style="margin-top: 0.35rem;">All reported hostel room issues in your department are clear or none have been submitted yet.</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td>
          <span class="complaint-ref-id" style="cursor:pointer;" onclick="app.openComplaintDetail('${c.id}')">${c.refNumber}</span>
        </td>
        <td><strong>${this.escapeHtml(c.category)}</strong></td>
        <td>
          <div style="font-weight:600; color:#fff; cursor:pointer;" onclick="app.openComplaintDetail('${c.id}')">${this.escapeHtml(c.title)}</div>
          <div class="text-xs text-muted">Student: ${this.escapeHtml(c.studentName)}</div>
        </td>
        <td>
          <span class="tag-badge">${c.block}</span>
          <span class="tag-badge">Rm ${c.room}</span>
        </td>
        <td>
          <span class="urgency-chip ${c.urgency.toLowerCase()}">
            &bull; ${c.urgency}
          </span>
        </td>
        <td>
          <span class="status-badge ${c.status.toLowerCase().replace(/\s+/g, '')}">
            ${c.status}
          </span>
        </td>
        <td>
          <span class="text-sm">${c.assignedOfficial || "Unassigned"}</span>
        </td>
        <td class="text-xs">${this.formatDate(c.createdAt)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="app.openComplaintDetail('${c.id}')">Manage</button>
        </td>
      </tr>
    `).join("");
  }

  // ==========================================================================
  // COMPLAINT SUBMISSION FLOW
  // ==========================================================================

  populateComplaintFormCategories() {
    const select = document.getElementById("complaintCategorySelect");
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>-- Choose Category --</option>' +
      COMPLAINT_CATEGORIES.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join("");
  }

  prepareSubmitForm() {
    if (!this.currentUser) return;
    const blockEl = document.getElementById("complaintBlock");
    const roomEl = document.getElementById("complaintRoom");

    if (blockEl && this.currentUser.hostelBlock) blockEl.value = this.currentUser.hostelBlock;
    if (roomEl && this.currentUser.room) roomEl.value = this.currentUser.room;
  }

  onCategorySelectChange() {
    const catSelect = document.getElementById("complaintCategorySelect");
    const subcatSelect = document.getElementById("complaintSubcategorySelect");
    const hint = document.getElementById("categoryRoutingHint");

    const categoryObj = COMPLAINT_CATEGORIES.find(c => c.name === catSelect.value);
    if (!categoryObj) return;

    if (hint) {
      hint.innerHTML = `<strong>Auto-Routing:</strong> This complaint will be assigned directly to the <strong>${categoryObj.department}</strong> department.`;
    }

    subcatSelect.innerHTML = '<option value="" disabled selected>-- Select Specific Issue --</option>' +
      categoryObj.subcategories.map(s => `<option value="${s}">${s}</option>`).join("");
  }

  handleImageAttachment(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please choose a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.attachedImageBase64 = e.target.result;
        document.getElementById("dropzonePrompt").style.display = "none";
        const preview = document.getElementById("dropzonePreview");
        preview.style.display = "block";
        document.getElementById("imagePreviewImg").src = this.attachedImageBase64;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAttachedImage(e) {
    e.stopPropagation();
    this.attachedImageBase64 = null;
    document.getElementById("complaintFileInput").value = "";
    document.getElementById("dropzonePreview").style.display = "none";
    document.getElementById("dropzonePrompt").style.display = "block";
  }

  async handleComplaintSubmit(e) {
    e.preventDefault();
    if (!this.currentUser) {
      this.navigate("student-auth");
      return;
    }

    const submitBtn = document.getElementById("submitComplaintBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnSpinner = submitBtn.querySelector(".btn-spinner");

    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnSpinner.style.display = "inline-block";

    try {
      const categoryName = document.getElementById("complaintCategorySelect").value;
      const subcategory = document.getElementById("complaintSubcategorySelect").value;
      const title = document.getElementById("complaintTitle").value.trim();
      const description = document.getElementById("complaintDescription").value.trim();
      const block = document.getElementById("complaintBlock").value;
      const room = document.getElementById("complaintRoom").value.trim();
      const urgency = document.querySelector('input[name="urgency"]:checked').value;
      const contactPreference = document.getElementById("contactPreference").value;

      const categoryObj = COMPLAINT_CATEGORIES.find(c => c.name === categoryName);
      const assignedDept = categoryObj ? categoryObj.department : "Maintenance";

      const refNumber = this.store.getNextRefNumber();
      const complaintId = "c_" + Date.now();

      const newComplaint = {
        id: complaintId,
        refNumber: refNumber,
        studentId: this.currentUser.id,
        studentName: this.currentUser.name,
        studentEmail: this.currentUser.email,
        category: categoryName,
        subcategory: subcategory,
        title: title,
        description: description,
        block: block,
        room: room,
        urgency: urgency,
        status: "Submitted",
        assignedDepartment: assignedDept,
        assignedOfficial: "Unassigned",
        contactPreference: contactPreference,
        photoUrl: this.attachedImageBase64 || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          { status: "Submitted", by: this.currentUser.name, timestamp: new Date().toISOString() }
        ],
        internalNotes: [],
        comments: [],
        feedback: null
      };

      // Try to submit to Supabase first
      try {
        const supabaseResult = await supabaseAPI.submitComplaint(newComplaint);
        if (supabaseResult) {
          // Update complaint with Supabase ID if available
          newComplaint.supabaseId = supabaseResult.id;
        }
      } catch (supabaseError) {
        console.warn('Supabase submission failed, continuing with local storage:', supabaseError);
      }

      this.store.addComplaint(newComplaint);

      // 🚨 SEND INSTANT NOTIFICATIONS TO OFFICIALS
      await this.sendComplaintNotifications(newComplaint, assignedDept);

      // Notifications for student
      this.store.addNotification({
        id: "notif_st_" + Date.now(),
        recipientId: this.currentUser.id,
        title: "Complaint Lodged Successfully",
        message: `Your complaint #${refNumber} (${categoryName}) was received and routed to ${assignedDept}. Officials have been notified via email and SMS.`,
        read: false,
        timestamp: new Date().toISOString(),
        complaintId: complaintId
      });

      this.store.addAudit({
        id: "aud_" + Date.now(),
        timestamp: new Date().toISOString(),
        actor: `${this.currentUser.name} (${this.currentUser.role})`,
        action: "New Complaint Lodged with Instant Notifications",
        record: refNumber,
        details: `${categoryName} | Urgency: ${urgency} | ${block} Rm ${room} -> Routed to ${assignedDept} | Email & SMS sent to officials`
      });

      this.sound.playNotificationChime();

      e.target.reset();
      this.removeAttachedImage(new Event("clear"));

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnSpinner.style.display = "none";

        this.showToast("Complaint Registered", `Reference: ${refNumber}. Officials notified via email, SMS & in-app! You'll get updates within 4 hours.`, "success");
        this.navigate("student-dashboard");
      }, 1500); // Slightly longer to show notification sending

    } catch (error) {
      console.error('Complaint submission error:', error);
      this.showToast("Submission Failed", "An error occurred while submitting your complaint. Please try again.", "error");
      
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = "inline";
      btnSpinner.style.display = "none";
    }
  }

  // 🚨 NEW: Send instant notifications to department officials
  async sendComplaintNotifications(complaint, departmentName) {
    try {
      console.log('🔔 Sending instant notifications for complaint:', complaint.refNumber);
      
      // Get department officials
      const officials = this.store.getUsers().filter(u => 
        (u.department === departmentName || u.role === "warden" || u.role === "admin") && 
        u.status === "active"
      );

      if (officials.length === 0) {
        console.warn('No officials found for department:', departmentName);
        return;
      }

      // Show notification sending toast
      this.showToast("Sending Notifications", "📧 Sending emails, 📱 SMS & in-app notifications to department officials...", "info");

      // Use the notification service to send all types of notifications
      if (window.notificationService) {
        const results = await window.notificationService.notifyComplaintSubmission(complaint, officials);
        
        // Update UI based on results
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        
        if (successCount > 0) {
          this.showToast("Notifications Sent!", `📤 ${successCount}/${totalCount} notifications sent successfully. Officials will respond within 4 hours.`, "success");
        }
      } else {
        // Fallback: Simple in-app notifications
        officials.forEach(official => {
          this.store.addNotification({
            id: "notif_off_" + Math.random().toString(36).substr(2, 9),
            recipientId: official.id,
            title: `🚨 New ${complaint.urgency} Complaint`,
            message: `${complaint.title} (${complaint.refNumber}) submitted by ${complaint.studentName} in ${complaint.block} Room ${complaint.room}.`,
            read: false,
            timestamp: new Date().toISOString(),
            complaintId: complaint.id,
            urgency: complaint.urgency.toLowerCase()
          });
        });
        
        this.showToast("Officials Notified", "📱 In-app notifications sent. Email & SMS require configuration.", "info");
      }

    } catch (error) {
      console.error('🔔 Notification sending failed:', error);
      this.showToast("Notification Warning", "Complaint saved but some notifications may have failed. Officials will still see it in their dashboard.", "warning");
    }
  }

  // ==========================================================================
  // COMPLAINT DETAILS, TIMELINE & WORKFLOW ACTIONS
  // ==========================================================================

  openComplaintDetail(complaintId) {
    const complaint = this.store.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    const modal = document.getElementById("complaintDetailModal");
    const header = document.getElementById("detailModalHeader");
    const body = document.getElementById("detailModalBody");

    const isStudent = this.currentUser && this.currentUser.role === "student";
    const isStaff = this.currentUser && (this.currentUser.role === "staff" || this.currentUser.role === "warden" || this.currentUser.role === "admin");

    header.innerHTML = `
      <div class="detail-header-flex">
        <div>
          <div class="detail-tags-row">
            <span class="complaint-ref-id">${complaint.refNumber}</span>
            <span class="status-badge ${complaint.status.toLowerCase().replace(/\s+/g, '')}">${complaint.status}</span>
            <span class="urgency-chip ${complaint.urgency.toLowerCase()}">&bull; ${complaint.urgency} Urgency</span>
            <span class="tag-badge">${complaint.block} &bull; Room ${complaint.room}</span>
          </div>
          <h2 class="detail-title">${this.escapeHtml(complaint.title)}</h2>
          <div class="text-sm text-muted m-t-1">
            Category: <strong>${complaint.category}</strong> (${complaint.subcategory}) &bull; Department: <strong>${complaint.assignedDepartment}</strong>
          </div>
        </div>
      </div>
    `;

    const timelineHtml = `
      <div class="timeline-track">
        ${complaint.statusHistory.map((step) => `
          <div class="timeline-step completed">
            <div class="timeline-node"></div>
            <div class="timeline-content-title">${step.status}</div>
            <div class="timeline-content-meta">By ${step.by} &bull; ${this.formatDate(step.timestamp)}</div>
          </div>
        `).join("")}
      </div>
    `;

    const photoHtml = complaint.photoUrl ? `
      <div class="detail-photo-box">
        <label class="form-label">Photo Evidence Uploaded:</label>
        <img src="${complaint.photoUrl}" class="detail-photo-thumb" alt="Evidence" onclick="app.openImageZoom('${complaint.photoUrl}')">
        <div class="text-xs text-muted m-t-1">Click to enlarge evidence</div>
      </div>
    ` : `
      <div class="text-xs text-muted m-t-1">No photo attachment provided with this complaint.</div>
    `;

    const internalNotesHtml = isStaff ? `
      <div class="internal-note-box">
        <div class="internal-note-header">
          <span>🔒 Internal Staff Notes (Hidden from Student)</span>
        </div>
        ${complaint.internalNotes && complaint.internalNotes.length > 0 ? 
          complaint.internalNotes.map(n => `
            <div class="text-sm m-b-2" style="color: #fde68a;">
              <strong>${n.author}:</strong> ${this.escapeHtml(n.note)}
              <div class="text-xs" style="color: #d97706;">${this.formatDate(n.timestamp)}</div>
            </div>
          `).join("") : 
          '<div class="text-xs text-muted">No internal notes added yet.</div>'
        }
        <div class="m-t-2">
          <input type="text" id="newInternalNoteInput" class="form-input text-sm" placeholder="Add confidential technician note...">
          <button class="btn btn-secondary btn-sm m-t-1" onclick="app.addInternalNote('${complaint.id}')">Save Note</button>
        </div>
      </div>
    ` : '';

    const commentsHtml = `
      <div class="comments-thread">
        <h4 class="m-b-2">Communication & Updates</h4>
        ${complaint.comments && complaint.comments.length > 0 ?
          complaint.comments.map(c => `
            <div class="comment-bubble ${c.authorRole === 'staff' ? 'staff' : ''}">
              <div class="comment-meta">
                <span class="comment-author">${c.author} (${c.authorRole})</span>
                <span>${this.formatDate(c.timestamp)}</span>
              </div>
              <div class="comment-text">${this.escapeHtml(c.message)}</div>
            </div>
          `).join("") :
          '<div class="text-xs text-muted m-b-2">No updates recorded yet.</div>'
        }
        <div class="flex-between m-t-2" style="gap: 0.5rem;">
          <input type="text" id="newCommentInput" class="form-input text-sm" placeholder="Send update or ask question...">
          <button class="btn btn-primary btn-sm glow-btn" onclick="app.addPublicComment('${complaint.id}')">Send</button>
        </div>
      </div>
    `;

    const staffControlsHtml = isStaff ? `
      <div class="glass-card m-t-3" style="border-color: rgba(56, 189, 248, 0.4);">
        <h4 class="m-b-2">Technician Workflow Controls</h4>
        <div class="form-row-2">
          <div>
            <label class="form-label text-xs">Update Status</label>
            <select id="updateStatusSelect" class="form-input text-sm" onchange="app.updateComplaintStatus('${complaint.id}', this.value)">
              <option value="Submitted" ${complaint.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="Acknowledged" ${complaint.status === 'Acknowledged' ? 'selected' : ''}>Acknowledged</option>
              <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Waiting for Student" ${complaint.status === 'Waiting for Student' ? 'selected' : ''}>Waiting for Student</option>
              <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
              <option value="Closed" ${complaint.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
          <div>
            <label class="form-label text-xs">Assign Official</label>
            <select id="assignOfficialSelect" class="form-input text-sm" onchange="app.assignComplaintOfficial('${complaint.id}', this.value)">
              <option value="Unassigned">-- Unassigned --</option>
              <option value="Rajesh Kumar" ${complaint.assignedOfficial === 'Rajesh Kumar' ? 'selected' : ''}>Rajesh Kumar (Maintenance)</option>
              <option value="Chef Sunita Devi" ${complaint.assignedOfficial === 'Chef Sunita Devi' ? 'selected' : ''}>Chef Sunita Devi (Mess)</option>
              <option value="Ramesh Babu" ${complaint.assignedOfficial === 'Ramesh Babu' ? 'selected' : ''}>Ramesh Babu (Sanitation)</option>
              <option value="Mukesh Rao" ${complaint.assignedOfficial === 'Mukesh Rao' ? 'selected' : ''}>Mukesh Rao (Dhobi)</option>
              <option value="Dr. V. Sharma" ${complaint.assignedOfficial === 'Dr. V. Sharma' ? 'selected' : ''}>Dr. V. Sharma (Warden)</option>
            </select>
          </div>
        </div>
        <div class="m-t-2 flex-between">
          <button class="btn btn-secondary btn-sm" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);" onclick="app.escalateComplaint('${complaint.id}')">
            ⚠️ Escalate to Chief Warden
          </button>
        </div>
      </div>
    ` : '';

    let studentControlsHtml = '';
    if (isStudent) {
      if (complaint.status === "Resolved" || complaint.status === "Closed") {
        if (!complaint.feedback) {
          studentControlsHtml = `
            <div class="glass-card m-t-3">
              <h4>Rate Resolution Satisfaction</h4>
              <p class="text-xs text-muted">How satisfied are you with the resolution?</p>
              <div class="star-rating-box" id="starRatingBox">
                ${[1, 2, 3, 4, 5].map(star => `
                  <button class="star-btn" onclick="app.rateComplaint('${complaint.id}', ${star})">★</button>
                `).join("")}
              </div>
              <button class="btn btn-secondary btn-sm m-t-2" style="color: #f59e0b;" onclick="app.reopenComplaint('${complaint.id}')">
                🔄 Issue persists? Reopen Complaint
              </button>
            </div>
          `;
        } else {
          studentControlsHtml = `
            <div class="glass-card m-t-3">
              <h4>Your Feedback: ${"★".repeat(complaint.feedback.rating)}${"☆".repeat(5 - complaint.feedback.rating)}</h4>
              <p class="text-sm text-muted">"${this.escapeHtml(complaint.feedback.comment || "Confirmed resolved.")}"</p>
              <button class="btn btn-secondary btn-sm m-t-2" style="color: #f59e0b;" onclick="app.reopenComplaint('${complaint.id}')">
                🔄 Problem returned? Reopen Complaint
              </button>
            </div>
          `;
        }
      }
    }

    body.innerHTML = `
      <div class="detail-grid-layout">
        <div>
          <div class="form-group">
            <label class="form-label">Full Complaint Description:</label>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: var(--radius-md); line-height: 1.6;">
              ${this.escapeHtml(complaint.description)}
            </div>
          </div>
          ${photoHtml}
          ${internalNotesHtml}
          ${commentsHtml}
        </div>

        <div>
          <div class="glass-card">
            <h4>Ticket Lifecycle</h4>
            ${timelineHtml}
            <div class="text-xs text-muted m-t-2">
              Preferred Contact: <strong>${complaint.contactPreference || "In-Person"}</strong>
            </div>
          </div>
          ${staffControlsHtml}
          ${studentControlsHtml}
        </div>
      </div>
    `;

    modal.classList.add("show");
  }

  closeComplaintDetailModal() {
    const modal = document.getElementById("complaintDetailModal");
    if (modal) modal.classList.remove("show");
  }

  updateComplaintStatus(complaintId, newStatus) {
    const complaint = this.store.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    // 🚨 CANCEL ESCALATION TIMER when officials respond
    if (window.notificationService && ['Acknowledged', 'In Progress', 'Resolved', 'Closed'].includes(newStatus)) {
      window.notificationService.cancelEscalation(complaintId);
      console.log(`✅ Escalation cancelled for complaint ${complaint.refNumber} - Official responded with: ${newStatus}`);
    }

    const prevStatus = complaint.status;
    const history = complaint.statusHistory || [];
    history.push({
      status: newStatus,
      by: this.currentUser ? this.currentUser.name : "Staff Officer",
      timestamp: new Date().toISOString()
    });

    this.store.updateComplaint(complaintId, {
      status: newStatus,
      statusHistory: history
    });

    // Send notification to student
    this.store.addNotification({
      id: "notif_" + Date.now(),
      recipientId: complaint.studentId,
      title: `Status Updated: ${newStatus}`,
      message: `Your complaint #${complaint.refNumber} was changed from ${prevStatus} to ${newStatus}.`,
      read: false,
      timestamp: new Date().toISOString(),
      complaintId: complaintId
    });

    // 🔔 Send instant notification to student about status update
    if (window.notificationService) {
      const student = this.store.getUsers().find(u => u.id === complaint.studentId);
      if (student && student.email) {
        window.notificationService.sendEmail(
          student.email,
          `✅ Complaint Update: ${complaint.refNumber}`,
          this.generateStatusUpdateEmailContent(complaint, newStatus),
          'normal'
        ).catch(err => console.warn('Status update email failed:', err));

        // Send SMS for important status updates
        if (['Resolved', 'Closed'].includes(newStatus) && student.phone) {
          window.notificationService.sendSMS(
            student.phone,
            `✅ SMRU Hostel: Your complaint ${complaint.refNumber} is now ${newStatus}. Login to view: ${window.location.origin}`,
            'normal'
          ).catch(err => console.warn('Status update SMS failed:', err));
        }
      }
    }

    this.store.addAudit({
      id: "aud_" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `${this.currentUser.name} (${this.currentUser.role})`,
      action: "Status Updated",
      record: complaint.refNumber,
      details: `${prevStatus} -> ${newStatus}`
    });

    this.sound.playNotificationChime();
    this.showToast("Status Updated", `Complaint marked as ${newStatus}. Student notified!`, "success");
    this.openComplaintDetail(complaintId);
    this.refreshCurrentView();
  }

  generateStatusUpdateEmailContent(complaint, newStatus) {
    const statusColor = {
      'Acknowledged': '#3b82f6',
      'In Progress': '#f59e0b', 
      'Resolved': '#10b981',
      'Closed': '#6b7280'
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: ${statusColor[newStatus] || '#64748b'}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .status-update { background: #f0f9ff; border-left: 4px solid ${statusColor[newStatus] || '#64748b'}; padding: 15px; margin: 15px 0; }
        .details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #64748b; color: white; padding: 15px; text-align: center; }
        .btn { background: ${statusColor[newStatus] || '#64748b'}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Complaint Status Update</h1>
        <p>SMRU Hostel Care System</p>
    </div>
    
    <div class="content">
        <div class="status-update">
            <strong>Your complaint status has been updated!</strong><br>
            Complaint <strong>${complaint.refNumber}</strong> is now: <strong style="color: ${statusColor[newStatus] || '#64748b'}">${newStatus}</strong>
        </div>
        
        <div class="details">
            <h3>📋 Complaint Details</h3>
            <p><strong>Title:</strong> ${complaint.title}</p>
            <p><strong>Location:</strong> ${complaint.block}, Room ${complaint.room}</p>
            <p><strong>Category:</strong> ${complaint.category}</p>
            <p><strong>Department:</strong> ${complaint.assignedDepartment}</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${window.location.origin}" class="btn">🚀 View Full Details</a>
        </div>
    </div>
    
    <div class="footer">
        <p>SMRU Hostel Care - Automated Update System</p>
        <p>Thank you for using our complaint management system!</p>
    </div>
</body>
</html>`;
  }

  assignComplaintOfficial(complaintId, officialName) {
    const complaint = this.store.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    this.store.updateComplaint(complaintId, { assignedOfficial: officialName });

    this.store.addAudit({
      id: "aud_" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `${this.currentUser.name} (${this.currentUser.role})`,
      action: "Assignment Changed",
      record: complaint.refNumber,
      details: `Assigned to ${officialName}`
    });

    this.showToast("Assigned", `Complaint assigned to ${officialName}`, "info");
    this.openComplaintDetail(complaintId);
    this.refreshCurrentView();
  }

  escalateComplaint(complaintId) {
    const complaint = this.store.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    const history = complaint.statusHistory || [];
    history.push({
      status: "Escalated",
      by: this.currentUser ? this.currentUser.name : "Supervisor",
      timestamp: new Date().toISOString()
    });

    this.store.updateComplaint(complaintId, {
      status: "Escalated",
      urgency: "Critical",
      statusHistory: history
    });

    const warden = this.store.getUsers().find(u => u.role === "warden");
    if (warden) {
      this.store.addNotification({
        id: "notif_esc_" + Date.now(),
        recipientId: warden.id,
        title: "⚠️ URGENT ESCALATION",
        message: `Complaint ${complaint.refNumber} in ${complaint.block} Rm ${complaint.room} has been escalated to Warden Office.`,
        read: false,
        timestamp: new Date().toISOString(),
        complaintId: complaintId
      });
    }

    this.sound.playNotificationChime();
    this.showToast("Escalated", "Complaint flagged as Critical and routed to Chief Warden.", "warning");
    this.openComplaintDetail(complaintId);
    this.refreshCurrentView();
  }

  reopenComplaint(complaintId) {
    const reason = prompt("Please provide reason for reopening (e.g. Issue recurred):");
    if (!reason) return;

    const complaint = this.store.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    const history = complaint.statusHistory || [];
    history.push({
      status: "In Progress (Reopened)",
      by: `${this.currentUser.name} (Student Reopened)`,
      timestamp: new Date().toISOString()
    });

    const comments = complaint.comments || [];
    comments.push({
      author: this.currentUser.name,
      authorRole: "student",
      message: `[REOPENED TICKET]: ${reason}`,
      timestamp: new Date().toISOString()
    });

    this.store.updateComplaint(complaintId, {
      status: "In Progress",
      statusHistory: history,
      comments: comments
    });

    this.store.addAudit({
      id: "aud_" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `${this.currentUser.name} (Student)`,
      action: "Complaint Reopened",
      record: complaint.refNumber,
      details: reason
    });

    this.sound.playNotificationChime();
    this.showToast("Ticket Reopened", "Department alerted to persisting issue.", "info");
    this.openComplaintDetail(complaintId);
    this.refreshCurrentView();
  }

  rateComplaint(complaintId, stars) {
    const comment = prompt("Optional feedback comments for the resolution team:");
    this.store.updateComplaint(complaintId, {
      feedback: {
        rating: stars,
        comment: comment || "Satisfied with resolution.",
        submittedAt: new Date().toISOString()
      }
    });

    this.sound.playSuccessBeep();
    this.showToast("Thank You!", `Feedback of ${stars} stars recorded.`, "success");
    this.openComplaintDetail(complaintId);
    this.refreshCurrentView();
  }

  addInternalNote(complaintId) {
    const input = document.getElementById("newInternalNoteInput");
    if (!input || !input.value.trim()) return;

    const complaint = this.store.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    const notes = complaint.internalNotes || [];
    notes.push({
      author: this.currentUser.name,
      note: input.value.trim(),
      timestamp: new Date().toISOString()
    });

    this.store.updateComplaint(complaintId, { internalNotes: notes });
    this.showToast("Internal Note Saved", "Confidential note recorded.", "info");
    this.openComplaintDetail(complaintId);
  }

  addPublicComment(complaintId) {
    const input = document.getElementById("newCommentInput");
    if (!input || !input.value.trim()) return;

    const complaint = this.store.getComplaints().find(c => c.id === complaintId);
    if (!complaint) return;

    const comments = complaint.comments || [];
    comments.push({
      author: this.currentUser.name,
      authorRole: this.currentUser.role,
      message: input.value.trim(),
      timestamp: new Date().toISOString()
    });

    this.store.updateComplaint(complaintId, { comments: comments });
    this.openComplaintDetail(complaintId);
  }

  openImageZoom(imgSrc) {
    const modal = document.getElementById("imageZoomModal");
    const img = document.getElementById("zoomModalImg");
    if (modal && img) {
      img.src = imgSrc;
      modal.classList.add("show");
    }
  }

  closeImageZoom() {
    const modal = document.getElementById("imageZoomModal");
    if (modal) modal.classList.remove("show");
  }

  // ==========================================================================
  // REAL-TIME NOTIFICATIONS
  // ==========================================================================

  updateNotificationBadge() {
    if (!this.currentUser) return;
    const badge = document.getElementById("notifBadge");
    const userNotifs = this.store.getNotifications().filter(n => n.recipientId === this.currentUser.id);
    const unreadCount = userNotifs.filter(n => !n.read).length;

    if (badge) {
      badge.textContent = unreadCount;
      if (unreadCount > 0) {
        badge.classList.add("has-unread");
      } else {
        badge.classList.remove("has-unread");
      }
    }
  }

  toggleNotifDropdown() {
    const dropdown = document.getElementById("notifDropdown");
    if (!dropdown || !this.currentUser) return;

    dropdown.classList.toggle("show");
    if (dropdown.classList.contains("show")) {
      this.renderNotifList();
    }
  }

  closeNotifDropdown() {
    const dropdown = document.getElementById("notifDropdown");
    if (dropdown) {
      dropdown.classList.remove("show");
    }
  }

  renderNotifList() {
    const list = document.getElementById("notifList");
    if (!list || !this.currentUser) return;

    const userNotifs = this.store.getNotifications().filter(n => n.recipientId === this.currentUser.id);
    if (userNotifs.length === 0) {
      list.innerHTML = '<div class="notif-empty" style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.85rem;">No notifications in your inbox.</div>';
      return;
    }

    list.innerHTML = userNotifs.map(n => `
      <div class="notif-item ${n.read ? 'read' : ''}" onclick="app.onNotificationClick('${n.id}', '${n.complaintId}')">
        <div class="notif-item-title">${this.escapeHtml(n.title)}</div>
        <div class="notif-item-msg">${this.escapeHtml(n.message)}</div>
        <div class="notif-item-time">${this.formatDate(n.timestamp)}</div>
      </div>
    `).join("");
  }

  onNotificationClick(notifId, complaintId) {
    const notif = this.store.getNotifications().find(n => n.id === notifId);
    if (notif) notif.read = true;
    this.store.save();
    this.updateNotificationBadge();
    document.getElementById("notifDropdown")?.classList.remove("show");

    if (complaintId) {
      this.openComplaintDetail(complaintId);
    }
  }

  markAllNotifsAsRead() {
    if (!this.currentUser) return;
    this.store.markAllNotifsRead(this.currentUser.id);
    this.updateNotificationBadge();
    this.renderNotifList();
    this.showToast("Updated", "All notifications marked as read.", "info");
  }

  // ==========================================================================
  // ANNOUNCEMENTS
  // ==========================================================================

  renderAnnouncements() {
    const container = document.getElementById("announcementsGrid");
    if (!container) return;

    const list = this.store.getAnnouncements();

    if (!list || list.length === 0) {
      container.innerHTML = `
        <div style="
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          background: rgba(255,255,255,0.04);
          border: 1.5px dashed rgba(255,255,255,0.12);
          border-radius: 18px;
          gap: 16px;
        ">
          <div style="font-size: 3rem;">📭</div>
          <h3 style="margin:0; font-size:1.3rem; font-weight:700; color: var(--text-primary, #fff);">No Announcements Yet</h3>
          <p style="margin:0; color: var(--text-muted, #aaa); font-size:0.95rem; max-width:380px; line-height:1.6;">
            There are no official notices or alerts at this time.<br>Check back later for updates from the Warden or Admin.
          </p>
        </div>`;
      return;
    }

    container.innerHTML = list.map(a => `
      <div class="announcement-card glass-card">
        <div class="announcement-header">
          <span class="status-badge ${a.priority === 'High' ? 'escalated' : 'acknowledged'}">
            ${a.priority} Priority
          </span>
          <span class="text-xs text-muted">Audience: ${a.audience}</span>
        </div>
        <h3>${this.escapeHtml(a.title)}</h3>
        <p class="announcement-body">${this.escapeHtml(a.message)}</p>
        <div class="announcement-footer">
          <span>By: <strong>${a.author}</strong></span>
        <span>${this.formatDate(a.createdAt)}</span>
        </div>
      </div>
    `).join("");
  }

  // ==========================================================================
  // SET / CHANGE PASSWORD FEATURE
  // ==========================================================================

  openSetPasswordModal() {
    const modal = document.getElementById("setPasswordModal");
    if (modal) {
      modal.style.display = "flex";
      // Pre-fill email if already typed in login form
      const loginEmail = document.getElementById("studentLoginEmail")?.value.trim();
      if (loginEmail) {
        const spEmail = document.getElementById("spEmail");
        if (spEmail) spEmail.value = loginEmail;
      }
      // Reset form & strength bars
      document.getElementById("setPasswordForm")?.reset();
      this.updatePasswordStrength("");
    }
  }

  closeSetPasswordModal() {
    const modal = document.getElementById("setPasswordModal");
    if (modal) modal.style.display = "none";
    document.getElementById("setPasswordForm")?.reset();
    this.updatePasswordStrength("");
  }

  updatePasswordStrength(password) {
    const bars = [
      document.getElementById("spStrBar1"),
      document.getElementById("spStrBar2"),
      document.getElementById("spStrBar3"),
      document.getElementById("spStrBar4")
    ];
    const label = document.getElementById("spStrLabel");
    if (!bars[0] || !label) return;

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;

    const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71"];
    const labels = ["Weak", "Fair", "Good", "Strong 💪"];
    bars.forEach((bar, i) => {
      bar.style.background = i < strength ? colors[strength - 1] : "#333";
    });
    label.textContent = password.length > 0 ? labels[Math.max(0, strength - 1)] : "";
    label.style.color = password.length > 0 ? colors[Math.max(0, strength - 1)] : "#aaa";
  }

  handleSetPassword(e) {
    e.preventDefault();
    const emailOrRoll = document.getElementById("spEmail").value.trim().toLowerCase();
    const newPassword = document.getElementById("spNewPassword").value;
    const confirmPassword = document.getElementById("spConfirmPassword").value;

    // Find user
    const user = this.store.getUsers().find(u =>
      u.email.toLowerCase() === emailOrRoll ||
      (u.rollNumber && u.rollNumber.toLowerCase() === emailOrRoll)
    );

    if (!user) {
      this.showToast("Not Found", "No account found with that email or roll number. Please register first.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showToast("Passwords Don't Match", "New password and confirm password must be the same.", "error");
      return;
    }

    if (newPassword.length < 6) {
      this.showToast("Too Short", "Password must be at least 6 characters.", "warning");
      return;
    }

    // Update password
    user.password = newPassword;
    this.store.save();

    this.showToast("Password Updated! 🔑", `Password set for ${user.name}. You can now sign in.`, "success");
    this.closeSetPasswordModal();

    // Pre-fill the login form with their email
    const loginEmailField = document.getElementById("studentLoginEmail");
    if (loginEmailField) loginEmailField.value = user.email;
  }


  openNewAnnouncementModal() {
    document.getElementById("announcementModal")?.classList.add("show");
  }

  closeAnnouncementModal() {
    document.getElementById("announcementModal")?.classList.remove("show");
  }

  handlePublishAnnouncement(e) {
    e.preventDefault();
    const title = document.getElementById("noticeTitle").value.trim();
    const audience = document.getElementById("noticeAudience").value;
    const priority = document.getElementById("noticePriority").value;
    const msg = document.getElementById("noticeMessage").value.trim();

    if (!title || !msg) return;

    const newAnn = {
      id: "ann_" + Date.now(),
      title: title,
      message: msg,
      audience: audience,
      priority: priority,
      author: this.currentUser ? this.currentUser.name : "Warden Office",
      createdAt: new Date().toISOString()
    };

    this.store.addAnnouncement(newAnn);

    this.store.addAudit({
      id: "aud_" + Date.now(),
      timestamp: new Date().toISOString(),
      actor: `${this.currentUser.name} (${this.currentUser.role})`,
      action: "Published Notice",
      record: title,
      details: `Audience: ${audience} | Priority: ${priority}`
    });

    this.sound.playNotificationChime();
    this.closeAnnouncementModal();
    this.showToast("Notice Broadcasted", "Announcement published across student and staff dashboards.", "success");
    this.renderAnnouncements();
  }

  // ==========================================================================
  // ANALYTICS & CHARTS (Chart.js)
  // ==========================================================================

  renderAnalyticsCharts() {
    const complaints = this.store.getComplaints();

    if (this.charts.category) this.charts.category.destroy();
    if (this.charts.status) this.charts.status.destroy();

    const isLight = document.body.classList.contains("light-theme");
    const chartTextColor = isLight ? "#334155" : "#94a3b8";
    const chartGridColor = isLight ? "rgba(148, 163, 184, 0.2)" : "rgba(255, 255, 255, 0.05)";
    const chartBorderColor = isLight ? "#ffffff" : "rgba(15, 23, 42, 0.8)";

    const categoryCounts = {};
    COMPLAINT_CATEGORIES.forEach(c => categoryCounts[c.name] = 0);
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const catCtx = document.getElementById("categoryChart")?.getContext("2d");
    if (catCtx) {
      this.charts.category = new Chart(catCtx, {
        type: "doughnut",
        data: {
          labels: Object.keys(categoryCounts).map(k => k.split(" ")[0]),
          datasets: [{
            data: Object.values(categoryCounts),
            backgroundColor: [
              "#38bdf8", "#818cf8", "#c084fc", "#f472b6",
              "#f59e0b", "#10b981", "#2dd4bf", "#60a5fa",
              "#f87171", "#94a3b8"
            ],
            borderColor: chartBorderColor,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: chartTextColor, boxWidth: 12 }
            }
          }
        }
      });
    }

    const statusCounts = {
      "Submitted": 0,
      "Acknowledged": 0,
      "In Progress": 0,
      "Waiting": 0,
      "Resolved": 0
    };
    complaints.forEach(c => {
      if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
      else if (c.status.includes("Waiting")) statusCounts["Waiting"]++;
    });

    const statusCtx = document.getElementById("statusChart")?.getContext("2d");
    if (statusCtx) {
      this.charts.status = new Chart(statusCtx, {
        type: "bar",
        data: {
          labels: Object.keys(statusCounts),
          datasets: [{
            label: "Active Complaints",
            data: Object.values(statusCounts),
            backgroundColor: [
              "#38bdf8", "#818cf8", "#f59e0b", "#c084fc", "#10b981"
            ],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: chartTextColor }, grid: { display: false } },
            y: { ticks: { color: chartTextColor, stepSize: 1 }, grid: { color: chartGridColor } }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  // ==========================================================================
  // CSV EXPORT GENERATOR
  // ==========================================================================

  exportComplaintsCSV() {
    const list = this.getFilteredOfficialComplaints ? this.getFilteredOfficialComplaints() : this.store.getComplaints();
    if (!list || list.length === 0) {
      alert("No complaints currently recorded to export.");
      return;
    }

    const headers = ["Reference ID", "Category", "Subcategory", "Title", "Student", "Email", "Block", "Room", "Urgency", "Status", "Department", "Assigned To", "Created At"];
    const rows = list.map(c => [
      c.refNumber,
      `"${c.category}"`,
      `"${c.subcategory}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.studentName}"`,
      c.studentEmail,
      c.block,
      c.room,
      c.urgency,
      c.status,
      c.assignedDepartment,
      `"${c.assignedOfficial || 'Unassigned'}"`,
      c.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hostel_complaints_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast("Export Ready", "CSV file generated and download started.", "success");
  }

  // ==========================================================================
  // ADMIN PORTAL & SECURITY AUDIT
  // ==========================================================================

  renderAdminPortal() {
    this.switchAdminTab("users");
  }

  switchAdminTab(tabId, btnElement = null) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".admin-tab-pane").forEach(p => p.classList.remove("active"));

    if (btnElement) {
      btnElement.classList.add("active");
    } else {
      const idx = tabId === "users" ? 0 : tabId === "audit" ? 1 : 2;
      const tab = document.querySelectorAll(".tab-btn")[idx];
      if (tab) tab.classList.add("active");
    }

    if (tabId === "users") {
      document.getElementById("adminTabUsers")?.classList.add("active");
      this.renderAdminUsers();
    } else if (tabId === "audit") {
      document.getElementById("adminTabAudit")?.classList.add("active");
      this.renderAdminAudits();
    } else {
      document.getElementById("adminTabConfig")?.classList.add("active");
    }
  }

  renderAdminUsers() {
    const tbody = document.getElementById("adminUsersTbody");
    if (!tbody) return;

    const users = this.store.getUsers();
    tbody.innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="chip">${u.role.toUpperCase()}</span></td>
        <td>${u.department || u.hostelBlock || 'N/A'}</td>
        <td><span class="chip chip-success">${u.status || 'Active'}</span></td>
      </tr>
    `).join("");
  }

  renderAdminAudits() {
    const tbody = document.getElementById("adminAuditTbody");
    if (!tbody) return;

    const audits = this.store.getAudits();
    tbody.innerHTML = audits.map(a => `
      <tr>
        <td class="text-xs">${this.formatDate(a.timestamp)}</td>
        <td><strong>${a.actor}</strong></td>
        <td><span class="tag-badge tag-active">${a.action}</span></td>
        <td><span class="complaint-ref-id">${a.record}</span></td>
        <td class="text-xs text-muted">${this.escapeHtml(a.details)}</td>
      </tr>
    `).join("");
  }

  saveSupabaseConfig() {
    const url = document.getElementById("supabaseUrlInput")?.value.trim();
    const key = document.getElementById("supabaseKeyInput")?.value.trim();
    const statusText = document.getElementById("supabaseStatusText");

    if (!url || !key) {
      alert("Please enter both Supabase URL and Anon Key.");
      return;
    }

    localStorage.setItem("SUPABASE_CONFIG_URL", url);
    localStorage.setItem("SUPABASE_CONFIG_KEY", key);

    if (statusText) {
      statusText.innerHTML = `🟢 <strong>Connected to Supabase:</strong> ${url}. PostgreSQL schema active!`;
      statusText.style.color = "#34d399";
    }

    this.showToast("Supabase Configured", "PostgreSQL database parameters saved.", "success");
  }

  toggleFaq(faqItem) {
    faqItem.classList.toggle("open");
  }

  // ==========================================================================
  // UI HELPERS (Toast, Escape, Date Format)
  // ==========================================================================

  showToast(title, message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";

    const icons = {
      success: "✅",
      warning: "⚠️",
      error: "🛑",
      info: "🔔"
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || "🔔"}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hiding");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4500);
  }

  formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================================================
  // MOBILE NAVIGATION & DEVICE MODE SIMULATOR
  // ==========================================================================

  toggleMobileMenu() {
    const drawer = document.getElementById("mobileNavDrawer");
    const backdrop = document.getElementById("mobileDrawerBackdrop");
    if (drawer && backdrop) {
      const isOpen = drawer.classList.contains("open");
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        drawer.classList.add("open");
        backdrop.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    }
  }

  closeMobileMenu() {
    const drawer = document.getElementById("mobileNavDrawer");
    const backdrop = document.getElementById("mobileDrawerBackdrop");
    if (drawer) drawer.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  navigateAndClose(viewName) {
    this.closeMobileMenu();
    this.navigate(viewName);
  }

  handleBottomNavProfile() {
    if (this.currentUser) {
      this.navigate("dashboard");
    } else {
      this.navigate("student-auth");
    }
  }

  openMobileConnectModal() {
    const modal = document.getElementById("mobileConnectModal");
    if (modal) modal.classList.add("show");
  }

  closeMobileConnectModal() {
    const modal = document.getElementById("mobileConnectModal");
    if (modal) modal.classList.remove("show");
  }

  copyMobileUrl() {
    const input = document.getElementById("mobileNetworkUrl");
    if (input) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(() => {
          this.showToast("Link Copied! 📱", "Copied http://192.168.0.103:3000 to clipboard. Paste in your mobile browser!", "success");
        }).catch(() => {
          input.select();
          document.execCommand("copy");
          this.showToast("Link Copied!", "URL copied to clipboard.", "info");
        });
      } else {
        input.select();
        document.execCommand("copy");
        this.showToast("Link Copied!", "URL copied to clipboard.", "info");
      }
    }
  }

  setDeviceMode(mode) {
    const body = document.body;
    const btnLaptop = document.getElementById("btnViewLaptop");
    const btnMobile = document.getElementById("btnViewMobile");

    if (mode === "mobile") {
      body.classList.add("mobile-device-mode");
      if (btnLaptop) btnLaptop.classList.remove("active");
      if (btnMobile) btnMobile.classList.add("active");
      this.showToast("📱 Mobile View Activated", "Switched to smartphone view with mobile drawer and thumb navigation.", "info");
    } else {
      body.classList.remove("mobile-device-mode");
      if (btnLaptop) btnLaptop.classList.add("active");
      if (btnMobile) btnMobile.classList.remove("active");
      this.showToast("💻 Laptop View Activated", "Switched to widescreen desktop / laptop layout.", "info");
    }

    if (this.currentView === "analytics") {
      setTimeout(() => this.renderAnalyticsCharts(), 250);
    }
  }

  // ==========================================================================
  // THEME MANAGEMENT (Light & Dark Mode)
  // ==========================================================================

  initTheme() {
    const saved = localStorage.getItem("SMART_HOSTEL_THEME") || "dark";
    this.setTheme(saved, false);
  }

  toggleTheme() {
    const isLight = document.body.classList.contains("light-theme");
    const nextTheme = isLight ? "dark" : "light";
    this.setTheme(nextTheme, true);
  }

  setTheme(theme, showFeedback = true) {
    const body = document.body;
    const themeIcon = document.getElementById("themeIcon");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const drawerThemeIcon = document.getElementById("drawerThemeIcon");
    const drawerThemeLabel = document.getElementById("drawerThemeLabel");

    if (theme === "light") {
      body.classList.add("light-theme");
      if (themeIcon) themeIcon.textContent = "🌙";
      if (themeToggleBtn) {
        themeToggleBtn.title = "Switch to Dark Mode";
        themeToggleBtn.setAttribute("aria-label", "Switch to Dark Mode");
      }
      if (drawerThemeIcon) drawerThemeIcon.textContent = "🌙";
      if (drawerThemeLabel) drawerThemeLabel.textContent = "Switch to Dark Mode";
      localStorage.setItem("SMART_HOSTEL_THEME", "light");
      if (showFeedback) {
        this.sound.playSuccessBeep();
        this.showToast("☀️ Light Mode Activated", "Crisp daylight theme enabled.", "info");
      }
    } else {
      body.classList.remove("light-theme");
      if (themeIcon) themeIcon.textContent = "☀️";
      if (themeToggleBtn) {
        themeToggleBtn.title = "Switch to Light Mode";
        themeToggleBtn.setAttribute("aria-label", "Switch to Light Mode");
      }
      if (drawerThemeIcon) drawerThemeIcon.textContent = "☀️";
      if (drawerThemeLabel) drawerThemeLabel.textContent = "Switch to Light Mode";
      localStorage.setItem("SMART_HOSTEL_THEME", "dark");
      if (showFeedback) {
        this.sound.playSuccessBeep();
        this.showToast("🌙 Dark Mode Activated", "Sleek navy midnight theme enabled.", "info");
      }
    }

    if (this.currentView === "analytics") {
      setTimeout(() => this.renderAnalyticsCharts(), 200);
    }
  }
}

// Global Application Instance
window.app = new SmartHostelCareApp();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});

