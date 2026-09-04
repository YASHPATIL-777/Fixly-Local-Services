import sys
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and render 'Page X of Y' 
    header and footer across all pages except the cover page.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Suppress running header/footer on title cover page
            return
        
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header text & line
        self.drawString(54, 752, "Fixly — Comprehensive Full-Stack System Architecture & File Guide")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 744, 558, 744)
        
        # Footer line & page numbers
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Confidential — Fixly Local Services Documentation")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        
        self.restoreState()

def build_pdf():
    pdf_filename = r"c:\Users\Omkar\Desktop\FULL STACK\Fixly_Full_Project_Documentation.pdf"
    
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Color Palette
    PRIMARY = colors.HexColor("#1E293B")       # Dark Slate / Charcoal
    SECONDARY = colors.HexColor("#2563EB")     # Sapphire Blue
    ACCENT = colors.HexColor("#0D9488")        # Teal Accent
    TEXT_DARK = colors.HexColor("#0F172A")     # Off-black body
    TEXT_MUTED = colors.HexColor("#475569")    # Slate Muted Text
    BG_LIGHT = colors.HexColor("#F8FAFC")      # Cool light gray box background
    BG_WARN = colors.HexColor("#FEF2F2")       # Soft red highlight background
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=PRIMARY,
        alignment=0,
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=SECONDARY,
        spaceAfter=24
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=SECONDARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=ACCENT,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=TEXT_DARK
    )

    table_cell_code = ParagraphStyle(
        'TableCellCode',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8,
        leading=11,
        textColor=SECONDARY
    )

    story = []

    # =========================================================================
    # COVER PAGE / HEADER
    # =========================================================================
    story.append(Spacer(1, 20))
    story.append(Paragraph("🛠️ Fixly — Local Service Booking Platform", title_style))
    story.append(Paragraph("Full-Stack Architectural Specification, File-by-File Reference, & System Operations Manual", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=3, color=SECONDARY, spaceBefore=0, spaceAfter=15))
    
    meta_box = [
        [Paragraph("<b>Author / Lead Engineer:</b> Omkar Narsale", body_style), Paragraph("<b>Tech Stack:</b> React 19, Vite 8, Node.js, Express, MongoDB", body_style)],
        [Paragraph("<b>Target Environment:</b> Node.js v20+, MongoDB 6+", body_style), Paragraph("<b>Authentication:</b> JWT + HttpOnly Cookies + Role Guard", body_style)],
        [Paragraph("<b>Documentation Date:</b> August 2026", body_style), Paragraph("<b>Real-time Engine:</b> Socket.io Event Bus", body_style)]
    ]
    meta_table = Table(meta_box, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    story.append(Paragraph("Executive Overview", h2_style))
    exec_summary = (
        "<b>Fixly</b> is an end-to-end, full-stack MERN (MongoDB, Express, React, Node.js) marketplace application "
        "designed to connect homeowners with verified local repair professionals (plumbers, electricians, AC technicians, "
        "cleaners, carpenters, and vehicle mechanics). The platform features role-based access control (Admin, Customer, Technician), "
        "an active booking lifecycle state machine, real-time Socket.io messaging, an automated rating & review recalculation engine, "
        "persistent notifications, and a comprehensive administrative control panel for platform moderation."
    )
    story.append(Paragraph(exec_summary, body_style))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 1: CREDENTIALS MATRIX & LOGIN ACCESS
    # =========================================================================
    story.append(Paragraph("1. Complete Login Credentials & Access Control Matrix", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Below is the complete table of pre-seeded login credentials generated by <code>seedAdmin.js</code> and <code>seedMarketplace.js</code>. "
        "These accounts provide full testing capability across all platform roles and access levels.",
        body_style
    ))
    story.append(Spacer(1, 8))

    cred_headers = ["Role", "Account Name / Details", "Email Address", "Password", "Access Level & Capabilities"]
    cred_data = [
        [Paragraph(h, table_header_style) for h in cred_headers],
        
        [Paragraph("<b>Admin</b>", table_cell_style),
         Paragraph("System Admin", table_cell_style),
         Paragraph("admin@fixnear.com", table_cell_code),
         Paragraph("Admin@123456", table_cell_code),
         Paragraph("Full administrative access to <code>/admin/*</code> dashboard, KPI analytics, user suspensions, tech profile verifications, and review moderation.", table_cell_style)],

        [Paragraph("<b>Customer</b>", table_cell_style),
         Paragraph("Vijay Sharma (Demo Customer)", table_cell_style),
         Paragraph("vijay@fixnear.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("Access to <code>/customer/dashboard</code>, service booking workflow, rating/review submission, and customer messaging.", table_cell_style)],

        [Paragraph("<b>Customer</b>", table_cell_style),
         Paragraph("Test Customer", table_cell_style),
         Paragraph("customer1@test.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("Secondary demo customer account for multi-session booking testing.", table_cell_style)],

        [Paragraph("<b>Technician</b>", table_cell_style),
         Paragraph("Rahul Kumar (Plumbing - Approved)", table_cell_style),
         Paragraph("rahul.kumar@fixly.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("Technician portal (<code>/technician/*</code>), job acceptance, active request state machine, and real-time customer chat.", table_cell_style)],

        [Paragraph("<b>Technician</b>", table_cell_style),
         Paragraph("Akash Patil (Electrical - Approved)", table_cell_style),
         Paragraph("akash.patil@fixly.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("Electrical contractor profile (Mumbai area), job request manager.", table_cell_style)],

        [Paragraph("<b>Technician</b>", table_cell_style),
         Paragraph("Priya Deshmukh (Cleaning - Approved)", table_cell_style),
         Paragraph("priya.deshmukh@fixly.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("Deep cleaning specialist profile (Thane area), job management dashboard.", table_cell_style)],

        [Paragraph("<b>Technician</b>", table_cell_style),
         Paragraph("Suresh Verma (AC Repair - Approved)", table_cell_style),
         Paragraph("suresh.verma@fixly.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("HVAC AC technician profile (Mulund area), active service management.", table_cell_style)],

        [Paragraph("<b>Technician</b>", table_cell_style),
         Paragraph("Rajesh Kumar (Carpentry - Approved)", table_cell_style),
         Paragraph("rajesh.carpenter@fixly.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("Master carpenter profile (Kalyan area), job dashboard.", table_cell_style)],

        [Paragraph("<b>Technician</b>", table_cell_style),
         Paragraph("Deepak Sawant (Vehicle Mechanic)", table_cell_style),
         Paragraph("deepak.mechanic@fixly.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("Doorstep mechanic profile (Mumbai area), roadside assistance requests.", table_cell_style)],

        [Paragraph("<b>Technician</b>", table_cell_style),
         Paragraph("Vikas Shinde (Plumbing - Pending)", table_cell_style),
         Paragraph("vikas.pending@fixly.com", table_cell_code),
         Paragraph("Password123", table_cell_code),
         Paragraph("<b>Pending Verification</b> profile used to test Admin Approval / Rejection flow in <code>/admin/technicians</code>.", table_cell_style)]
    ]

    cred_table = Table(cred_data, colWidths=[60, 110, 110, 75, 149])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 15))

    # =========================================================================
    # SECTION 2: CORE FEATURES & SYSTEM ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("2. System Architecture & Core Feature Workflows", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=10))

    features = [
        ("🔐 Dual-Role Authentication & Access Control",
         "The system implements JWT-based authentication stored in HTTP-Only cookies (or Bearer header fallback). "
         "Users have standard roles: <code>customer</code>, <code>technician</code>, or <code>admin</code>. "
         "Middleware enforces role protection (<code>protect</code>, <code>authorize('admin')</code>, etc.) "
         "and blocks suspended accounts immediately via <code>accountStatus === 'SUSPENDED'</code> checks."),

        ("🔄 Booking Request Lifecycle State Machine",
         "Service requests follow a strictly controlled transition flow:<br/>"
         "<b>PENDING</b> $\\longrightarrow$ <b>ACCEPTED</b> $\\longrightarrow$ <b>IN_PROGRESS</b> $\\longrightarrow$ <b>COMPLETED</b><br/>"
         "Or alternatively transitioning to <b>REJECTED</b> or <b>CANCELLED</b>. "
         "Each state update triggers database updates, persistent notification generation, and real-time WebSocket events."),

        ("💬 Real-time Socket.io Chat Engine",
         "Full-stack WebSocket integration via Socket.io allows customers and technicians to communicate per booking request. "
         "Messages are routed to request-specific socket rooms (<code>request_id</code>) and persisted in MongoDB under the <code>ChatMessage</code> schema."),

        ("⭐ Automated Rating Recalculation Engine",
         "When a customer submits a review for a completed service, the system automatically recalculates the targeted technician's average rating "
         "and increments their total review count: "
         "$$\\text{New Rating} = \\frac{\\sum \\text{Review Stars}}{\\text{Total Reviews}}$$ "
         "If an administrator deletes a review, the engine automatically rolls back and recalculates the technician's rating."),

        ("🔔 Persistent Notification Engine",
         "Notifications are stored in MongoDB with read/unread status (`isRead`). "
         "The frontend <code>NotificationBell</code> component polls or receives socket notifications, rendering an unread counter badge "
         "and allowing single or bulk 'Mark as Read' operations."),

        ("🛡️ Admin Control Panel & Verification Queue",
         "The Admin panel provides platform oversight: MongoDB KPI calculations (Total Users, Verification Requests, Booking Counts, Completion Rate), "
         "technician profile verification (Approve/Reject with feedback), account suspension toggles, and review moderation."),

        ("🖼️ Image Upload Pipeline",
         "Supports multi-file problem photo attachments for service requests and profile avatars. "
         "Uses <code>Multer</code> with a local fallback storage engine (`uploads/`) and direct integration with <code>Cloudinary</code>.")
    ]

    for title, desc in features:
        story.append(Paragraph(title, h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: BACKEND FILE-BY-FILE ANALYSIS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("3. Backend Architecture & Detailed File Analysis (server/)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The Express.js backend follows a modular Controller-Service-Model architecture with Mongoose ODM. "
        "Below is the complete breakdown of every file located within the <code>server/</code> directory.",
        body_style
    ))
    story.append(Spacer(1, 8))

    server_files = [
        ("server.js", "Server Entry Point",
         "Initializes Express application, establishes database connection via <code>connectDB()</code>, configures CORS, cookie-parser, "
         "JSON body parsers, static file serving for <code>/uploads</code>, attaches API routes (auth, services, technicians, requests, reviews, admin, notifications, chat), "
         "initializes Socket.io HTTP server, and sets up central error handling middleware."),

        ("seedAdmin.js", "Admin Seeding Script",
         "One-time database script to create the master administrator account (<code>admin@fixnear.com</code> / <code>Admin@123456</code>). "
         "Ensures database connection, checks for pre-existing admin user to prevent duplicate keys, hashes password with bcrypt, and assigns <code>role: 'admin'</code>."),

        ("seedMarketplace.js", "Marketplace Seeding Script",
         "Comprehensive seed script that populates MongoDB with initial service categories (Plumbing, Electrical, AC Repair, Cleaning, etc.), "
         "sample customer profiles (Vijay Sharma), and 7 pre-configured technician profiles complete with detailed bios, skills, location areas, hourly rates, and ratings."),

        ("config/db.js", "MongoDB Connection Manager",
         "Uses Mongoose to establish a connection to local or MongoDB Atlas cluster based on <code>process.env.MONGODB_URI</code>. "
         "Includes connection error catching and process termination logic on failure."),

        ("config/socket.js", "Socket.io Initialization & Event Handlers",
         "Configures Socket.io server instance with CORS. Handles client connection/disconnection events, room joining (`join_room`), "
         "and real-time message relaying (`send_message`, `receive_message`). Authenticates socket connections via JWT tokens."),

        ("config/cloudinary.js", "Cloudinary Storage Integration",
         "Configures Cloudinary SDK credentials (cloud name, API key, API secret) for remote cloud image hosting. "
         "Provides Cloudinary Storage engine instance for Multer integration."),

        ("controllers/adminController.js", "Platform Analytics & Moderation",
         "Contains handlers for administrative tasks: <code>getDashboardStats</code> (calculates real-time platform KPIs, completion rates), "
         "<code>getAllUsers</code> (lists all registered accounts), <code>updateUserStatus</code> (toggles account suspension `ACTIVE`/`SUSPENDED`), "
         "<code>getPendingTechnicians</code> (filters unverified pros), <code>verifyTechnician</code> (approves or rejects tech applications), "
         "and <code>deleteReviewAdmin</code> (deletes reviews and recalculates ratings)."),

        ("controllers/authController.js", "Authentication & JWT Management",
         "Handles user registration (<code>registerUser</code>), user login (<code>loginUser</code>), user logout (<code>logoutUser</code>), "
         "and fetching current user profile (<code>getMe</code>). Generates JWT tokens stored in HTTP-Only cookies or returned in response JSON."),

        ("controllers/chatController.js", "Chat Messaging Controller",
         "Handles fetching past message history (<code>getChatHistory</code>) for a specific service request and sending new chat messages (<code>sendMessage</code>) "
         "to MongoDB while emitting WebSocket events to active room subscribers."),

        ("controllers/notificationController.js", "Notification Handler",
         "Provides endpoints for fetching user-specific notifications (<code>getUserNotifications</code>), counting unread notifications, "
         "marking individual notifications as read (<code>markAsRead</code>), and bulk marking all as read (<code>markAllAsRead</code>)."),

        ("controllers/requestController.js", "Service Request Lifecycle Controller",
         "Core business engine managing booking requests: <code>createRequest</code> (customer creates request with optional image attachments), "
         "<code>getCustomerRequests</code>, <code>getTechnicianRequests</code>, <code>getRequestById</code>, "
         "<code>acceptRequest</code>, <code>rejectRequest</code>, <code>startService</code> (`IN_PROGRESS`), and <code>completeService</code> (`COMPLETED`). "
         "Generates notifications for both parties on state transitions."),

        ("controllers/reviewController.js", "Ratings & Reviews Controller",
         "Manages creation of verified customer reviews (<code>createReview</code>) for completed bookings. Validates customer ownership, "
         "prevents duplicate reviews per booking, saves review to database, and triggers <code>recalculateTechnicianRating()</code>."),

        ("controllers/serviceController.js", "Service Category Handler",
         "Manages service categories: <code>getAllServices</code> (lists available services with icons and slugs), "
         "<code>getServiceBySlug</code>, and administrative service management (<code>createService</code>, <code>updateService</code>, <code>deleteService</code>)."),

        ("controllers/technicianController.js", "Technician Discovery & Profile Controller",
         "Handles searching and filtering technicians (<code>getTechnicians</code> by service, location, rating, price), "
         "fetching technician profiles by ID (<code>getTechnicianById</code>), and updating technician profile details, skills, service areas, and availability."),

        ("middleware/authMiddleware.js", "Authentication & Authorization Guards",
         "Contains <code>protect</code> middleware (verifies JWT token from cookies or Authorization header, populates <code>req.user</code>, blocks suspended accounts) "
         "and <code>authorize(...roles)</code> middleware (restricts route execution based on user roles)."),

        ("middleware/errorMiddleware.js", "Global Error Handling Middleware",
         "Intercepts unhandled errors, formats structured JSON error responses with status codes (400, 401, 403, 404, 500), "
         "and provides stack traces in development mode."),

        ("middleware/uploadMiddleware.js", "Multer Image Upload Handler",
         "Configures Multer file upload storage with disk or memory storage, file size limits (5MB), and file type filtering (JPEG, PNG, WebP)."),

        ("models/User.js", "User Schema (Mongoose)",
         "Defines User database schema: `name`, `email` (unique, lowercase), `phone`, `password` (bcrypt hashed via pre-save hook), "
         "`role` (`customer`, `technician`, `admin`), `accountStatus` (`ACTIVE`, `SUSPENDED`), `createdAt` timestamp. Includes `matchPassword()` instance method."),

        ("models/Technician.js", "Technician Profile Schema",
         "Defines Technician extension schema: `userId` (ref User), `serviceCategory`, `serviceIds` (ref Service array), `bio`, `experienceYears`, "
         "`skills` array, `location`, `serviceArea` array, `hourlyRate`, `availability` boolean, `profileImage`, `rating` (default 0), "
         "`totalReviews` (default 0), `verificationStatus` (`pending`, `approved`, `rejected`), `rejectionReason`."),

        ("models/Service.js", "Service Category Schema",
         "Defines Service category schema: `name`, `slug` (unique), `description`, `icon` (Lucide icon string identifier), `category`."),

        ("models/ServiceRequest.js", "Booking Request Schema",
         "Defines ServiceRequest schema: `customer` (ref User), `technician` (ref Technician), `service` (ref Service), "
         "`title`, `description`, `address`, `scheduledDate`, `status` (`PENDING`, `ACCEPTED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), "
         "`problemPhotos` array, `cancellationReason`."),

        ("models/Review.js", "Review Schema",
         "Defines Review schema: `request` (ref ServiceRequest), `customer` (ref User), `technician` (ref Technician), "
         "`rating` (1-5 numeric stars), `comment`, `createdAt`."),

        ("models/Notification.js", "Notification Schema",
         "Defines Notification schema: `recipient` (ref User), `sender` (ref User), `title`, `message`, `type` (`JOB_REQUEST`, `STATUS_UPDATE`, `REVIEW`, `VERIFICATION`), "
         "`relatedRequest` (ref ServiceRequest), `isRead` (boolean)."),

        ("models/ChatMessage.js", "Chat Message Schema",
         "Defines ChatMessage schema: `request` (ref ServiceRequest), `sender` (ref User), `message`, `attachments` array, `createdAt`."),

        ("routes/adminRoutes.js", "Admin Router",
         "Defines endpoints for administrative panel: <code>GET /stats</code>, <code>GET /users</code>, <code>PATCH /users/:id/status</code>, "
         "<code>GET /technicians/pending</code>, <code>PATCH /technicians/:id/verify</code>, <code>DELETE /reviews/:id</code>. Guarded by <code>protect, authorize('admin')</code>."),

        ("routes/authRoutes.js", "Auth Router",
         "Defines authentication endpoints: <code>POST /register</code>, <code>POST /login</code>, <code>POST /logout</code>, <code>GET /me</code>."),

        ("routes/chatRoutes.js", "Chat Router",
         "Defines messaging endpoints: <code>GET /:requestId</code>, <code>POST /:requestId</code>. Protected by authentication middleware."),

        ("routes/notificationRoutes.js", "Notification Router",
         "Defines notification management endpoints: <code>GET /</code>, <code>PATCH /:id/read</code>, <code>PATCH /read-all</code>."),

        ("routes/requestRoutes.js", "Service Request Router",
         "Defines booking lifecycle endpoints: <code>POST /</code>, <code>GET /customer</code>, <code>GET /technician</code>, <code>GET /:id</code>, "
         "<code>PATCH /:id/accept</code>, <code>PATCH /:id/reject</code>, <code>PATCH /:id/start</code>, <code>PATCH /:id/complete</code>."),

        ("routes/reviewRoutes.js", "Review Router",
         "Defines review creation endpoints: <code>POST /</code>, <code>GET /technician/:technicianId</code>."),

        ("routes/roleRoutes.js", "Role Router",
         "Utility router for querying available user roles and permissions."),

        ("routes/serviceRoutes.js", "Service Router",
         "Defines public service category routes: <code>GET /</code>, <code>GET /:slug</code>, and admin CRUD routes."),

        ("routes/technicianRoutes.js", "Technician Router",
         "Defines professional discovery routes: <code>GET /</code>, <code>GET /:id</code>, <code>PUT /profile</code>."),

        ("utils/generateToken.js", "JWT Generation Token Helper",
         "Utility function that signs JWT tokens using <code>JWT_SECRET</code> with expiration (30d) and sets HTTP-Only cookie options."),

        ("utils/uploadStorage.js", "File Upload Storage Utility",
         "Configures storage engines and destination paths for local uploads directory (`uploads/`).")
    ]

    for fname, ftitle, fdesc in server_files:
        p_box = [
            [Paragraph(f"<b>{fname}</b> — <font color='{ACCENT}'>{ftitle}</font>", h3_style)],
            [Paragraph(fdesc, body_style)]
        ]
        t = Table(p_box, colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t)
        story.append(Spacer(1, 4))

    # =========================================================================
    # SECTION 4: FRONTEND FILE-BY-FILE ANALYSIS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("4. Frontend Architecture & Detailed File Analysis (src/)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "The React 19 frontend client is built with Vite 8 and Tailwind CSS 4. "
        "It features dynamic Framer Motion animations, Lucide React icons, context-driven state management, "
        "and client API wrapper services. Below is the detailed analysis of every file in <code>src/</code>.",
        body_style
    ))
    story.append(Spacer(1, 8))

    frontend_files = [
        ("main.jsx", "Client React Application Entry Point",
         "Renders the root React node into DOM `root` element. Wraps application with `BrowserRouter`, `AuthProvider`, and `SocketProvider`."),

        ("App.jsx", "Main Routing & Portal Layout Router",
         "Configures application routes using `react-router-dom`. Sets up public routes (`/`, `/login`, `/register`, `/services`, `/technicians`), "
         "customer routes (`/customer/dashboard`, `/customer/requests`, `/create-request`), technician routes (`/technician/dashboard`, `/technician/requests`), "
         "admin portal sub-routes (`/admin/*`), and messaging routes (`/messages`, `/chat/:requestId`). Enforces `ProtectedRoute` guards."),

        ("index.css", "Design Tokens & Tailwind CSS Imports",
         "Defines custom HSL design tokens, color CSS variables (`--color-background: #F7F6F2`, `--color-primary`, `--color-accent`), "
         "glassmorphism utility classes (`.backdrop-blur-md`), custom scrollbars, and Tailwind CSS v4 imports."),

        ("App.css", "Application Specific Styles",
         "Contains supplemental CSS rules, responsive animation keyframes, and custom layout adjustments."),

        ("context/AuthContext.jsx", "Authentication & User State Provider",
         "Global context maintaining current user state (`user`), authentication loading status (`loading`), and auth functions "
         "(`login`, `register`, `logout`, `fetchCurrentUser`). Automatically restores active session from server cookie on load."),

        ("context/SocketContext.jsx", "Socket.io Client Provider",
         "Global context establishing WebSocket connection to backend server when authenticated. Exposes socket instance and real-time event listeners."),

        ("services/adminService.js", "Admin API Client Wrapper",
         "Encapsulates HTTP requests for administrative actions: fetching KPI stats, listing users, toggling account status, fetching pending technicians, verifying tech profiles, deleting reviews."),

        ("services/chatService.js", "Chat API Client Wrapper",
         "Provides client functions to fetch chat history by request ID and send new messages via REST endpoint."),

        ("services/notificationService.js", "Notification API Client Wrapper",
         "Encapsulates API requests to fetch user notifications, mark single notification as read, and bulk mark all as read."),

        ("services/requestService.js", "Service Request API Client Wrapper",
         "Handles API calls for creating requests, fetching customer/technician request lists, fetching single request details, "
         "accepting requests, rejecting requests, starting services, and completing services."),

        ("services/reviewService.js", "Review API Client Wrapper",
         "Encapsulates API requests for submitting 5-star customer reviews and fetching technician review lists."),

        ("services/serviceService.js", "Service Category API Client Wrapper",
         "Provides client methods to fetch all service categories and single service category by slug."),

        ("services/technicianService.js", "Technician API Client Wrapper",
         "Handles searching, filtering, and fetching technician profiles and updating technician availability or details."),

        ("utils/api.js", "Axios Base Instance & Interceptors",
         "Configures base Axios client with backend URL (`http://localhost:5000/api`), `withCredentials: true` for HTTP-Only cookies, "
         "and global response interceptors for handling 401 unauthenticated or 403 account suspension responses."),

        ("utils/routeUtils.js", "Navigation & Role Route Helpers",
         "Helper functions for computing default redirect routes based on user role (`admin` $\\rightarrow$ `/admin/dashboard`, `technician` $\\rightarrow$ `/technician/dashboard`, `customer` $\\rightarrow$ `/customer/dashboard`)."),

        ("pages/LandingPage.jsx", "Public Home Landing Page",
         "Main SaaS landing page featuring floating pill navbar, 3-Card Hero composition (`HeroVisual`), 8-category asymmetrical service grid, "
         "how-it-works process breakdown, technician showcase carousel, platform stats, and footer."),

        ("pages/LoginPage.jsx", "User Login Page",
         "Renders role-selected login form (Customer, Technician, Admin) with quick demo auto-fill buttons, password toggle, error alerts, and auth submit logic."),

        ("pages/RegisterPage.jsx", "Account Registration Page",
         "Supports dual registration for Customers and Technicians. Includes multi-step form fields for technicians (service category, skills, hourly rate, bio, location)."),

        ("pages/ServicesPage.jsx", "Service Categories Catalog Page",
         "Displays grid of all available home service categories with search filter and detailed category breakdown cards."),

        ("pages/ServiceDetailPage.jsx", "Category Detail & Technicians List Page",
         "Shows specific service details and filters top rated verified technicians specialized in that service category."),

        ("pages/TechniciansPage.jsx", "Technician Directory & Search Page",
         "Searchable directory of verified professionals with filters for category, location, rating, and price range."),

        ("pages/TechnicianDetailPage.jsx", "Technician Public Profile Page",
         "Comprehensive profile view showing technician bio, verified badge, skills list, service area tags, customer reviews list, and instant 'Book Service' button."),

        ("pages/CreateRequestPage.jsx", "Service Booking Creation Page",
         "Form page for customers to submit a new repair request with title, description, address, date picker, and multi-image photo upload."),

        ("pages/RequestDetailPage.jsx", "Booking Lifecycle & Detail View Page",
         "Detailed view of a specific booking request showing current lifecycle stage (`StatusTimeline`), customer/technician details, uploaded problem photos, and action triggers."),

        ("pages/CustomerDashboard.jsx", "Customer Management Dashboard",
         "Main portal page for customers displaying active bookings summary, past service history, quick re-book triggers, and notification feeds."),

        ("pages/CustomerRequestsPage.jsx", "Customer Bookings List Page",
         "Filterable list view of all bookings created by the customer categorized by status (Active, Completed, Cancelled)."),

        ("pages/TechnicianDashboard.jsx", "Technician Workspace Dashboard",
         "Main workspace page for technicians displaying incoming pending job alerts, quick accept/reject actions, earnings summary, and active job status."),

        ("pages/TechnicianRequestsPage.jsx", "Technician Jobs Manager Page",
         "Filterable list of technician job assignments with controls to advance service lifecycle (`Start Service`, `Mark Completed`)."),

        ("pages/MessagesPage.jsx", "Messaging Conversations Center",
         "List of active messaging channels between customer and technician per booking request."),

        ("pages/ChatPage.jsx", "Real-time Chat Screen",
         "Full screen chat view integrating `ChatView` component with Socket.io real-time message exchange and message archival."),

        ("pages/AdminDashboard.jsx", "Admin Main KPI Dashboard",
         "Admin overview page featuring MongoDB aggregate statistics (Total Users, Verification Requests, Bookings, Completion Rate) and quick action queues."),

        ("pages/AdminAnalyticsPage.jsx", "Admin Platform Analytics Page",
         "Detailed visual breakdown of platform growth metrics, service distribution charts, and completion performance."),

        ("pages/AdminRequestsPage.jsx", "Admin Booking Supervision Page",
         "Administrative view of all platform bookings with status filtering and audit capability."),

        ("pages/AdminReviewsPage.jsx", "Admin Review Moderation Page",
         "Moderation portal allowing administrators to inspect customer reviews and delete inappropriate content with automatic rating recalculation."),

        ("pages/AdminTechniciansPage.jsx", "Admin Technician Verification Queue Page",
         "Verification queue where admins review pending technician applications and execute `Approve` or `Reject` actions with notes."),

        ("pages/AdminUsersPage.jsx", "Admin User Management Page",
         "User management portal allowing administrators to toggle user accounts between `ACTIVE` and `SUSPENDED`."),

        ("components/3d/Hero3DScene.jsx", "Interactive Visual Hero Component",
         "3D/Canvas visual backdrop element enhancing hero section aesthetics."),

        ("components/cards/BookingCard.jsx", "Service Booking Summary Card",
         "Reusable UI card displaying booking request summary, status badge, date, customer/tech info, and view details action."),

        ("components/cards/DashboardCard.jsx", "Metric KPI Display Card",
         "SaaS style metric card displaying stat title, numerical value, icon, and percentage change indicator."),

        ("components/cards/ServiceCard.jsx", "Service Category Grid Card",
         "Interactive card displaying service icon, title, description summary, and quick link to category detail."),

        ("components/cards/TechnicianCard.jsx", "Technician Profile Summary Card",
         "Card displaying technician avatar, rating stars, total reviews, location, hourly rate, and direct profile link."),

        ("components/chat/ChatView.jsx", "Chat UI Thread Component",
         "Message thread container with auto-scroll, message bubbles, timestamp formatting, and text/attachment input form."),

        ("components/common/AnimatedCounter.jsx", "Animated Number Roll Component",
         "Framer Motion driven numerical counter for smooth KPI stat counting animations."),

        ("components/common/AnimatedCountUp.jsx", "Count Up Animation Utility",
         "Alternative count-up animation component for metric cards."),

        ("components/common/ErrorState.jsx", "Error Alert Display Component",
         "Reusable fallback component for rendering error messages and retry buttons."),

        ("components/common/ImageLightbox.jsx", "Image Preview Lightbox Modal",
         "Modal dialog for viewing full-size problem photos and uploaded image attachments."),

        ("components/common/ImageUploader.jsx", "Multi-file Upload Component",
         "File drop zone and file input selector supporting multi-image upload with thumbnail previews and removal triggers."),

        ("components/common/NotificationBell.jsx", "Header Notification Bell & Popover",
         "Navbar bell icon with live unread counter badge, dropdown notification list, and mark-as-read controls."),

        ("components/common/ProblemPhotos.jsx", "Problem Photos Grid Gallery",
         "Thumbnail grid displaying problem photos attached to service requests with lightbox trigger."),

        ("components/common/RatingStars.jsx", "Star Rating Display Component",
         "Renders 1-5 star visual indicators with support for half stars and numeric rating labels."),

        ("components/common/StatusBadge.jsx", "Lifecycle Status Badge",
         "Color-coded badge component for request statuses (`PENDING` yellow, `ACCEPTED` blue, `IN_PROGRESS` purple, `COMPLETED` green, `REJECTED` red)."),

        ("components/common/StatusTimeline.jsx", "Interactive Booking Progress Tracker",
         "Horizontal stepper component rendering active request lifecycle progress from Pending to Completed."),

        ("components/home/HeroVisual.jsx", "3-Card Parallax Hero Composition",
         "Signature 3-Card floating hero visual (Rahul Kumar Card, Completed Job Badge, New Request Alert) with Framer Motion hover depth."),

        ("components/layout/AdminSidebar.jsx", "Admin Panel Navigation Sidebar",
         "Sidebar navigation for `/admin/*` portal featuring links to Analytics, Users, Technicians Verification, Requests, and Reviews."),

        ("components/layout/Navbar.jsx", "Floating Pill Navigation Bar",
         "Top navbar with backdrop blur (`backdrop-blur-md`), centered route links, role portal dropdown, and `NotificationBell`."),

        ("components/layout/Footer.jsx", "Application Main Footer",
         "Full width footer containing brand info, category quick links, contact info, and copyright notice."),

        ("components/layout/PageTransition.jsx", "Framer Motion Page Wrapper",
         "Wrapper component applying fade and slide animation transitions between route page changes."),

        ("components/layout/Sidebar.jsx", "Role Portal Sidebar",
         "General sidebar component for customer and technician portal dashboards."),

        ("components/routes/ProtectedRoute.jsx", "Role Based Auth Route Guard",
         "Route container enforcing user authentication and role verification before rendering child page components. Redirects unauthenticated users to `/login`."),

        ("components/showcase/ProductShowcase.jsx", "Product Feature Showcase Grid",
         "Interactive section showcasing key platform capabilities with tabbed views.")
    ]

    for fname, ftitle, fdesc in frontend_files:
        p_box = [
            [Paragraph(f"<b>{fname}</b> — <font color='{ACCENT}'>{ftitle}</font>", h3_style)],
            [Paragraph(fdesc, body_style)]
        ]
        t = Table(p_box, colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t)
        story.append(Spacer(1, 4))

    # =========================================================================
    # SECTION 5: ROOT CONFIGURATIONS & API REFERENCE
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("5. Root Configuration Files & Full API Endpoint Reference", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("Root Configuration Files", h2_style))
    
    root_files = [
        (".env", "Environment Variables File", "Contains server runtime configuration: `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=development`, and Cloudinary keys."),
        (".env.example", "Template Environment Config", "Template detailing required environment variables for deployment reference."),
        ("package.json", "Node.js Dependencies & Scripts", "Defines project dependencies (`react`, `vite`, `express`, `mongoose`, `socket.io`, `framer-motion`, `tailwindcss`, `jsonwebtoken`, `bcryptjs`) and scripts (`npm run dev`, `npm run server`, `npm run seed`)."),
        ("vite.config.js", "Vite Development Server Config", "Configures Vite build options, React plugin, Tailwind CSS v4 integration, and dev server proxy settings."),
        ("vercel.json", "Vercel Deployment Route Rewrite", "Defines single-page application SPA route rewrites for Vercel edge deployment."),
        ("index.html", "HTML Document Root", "HTML entry template mounting Google Fonts (`Inter`), viewport meta tags, and main React entry script.")
    ]

    for fname, ftitle, fdesc in root_files:
        p_box = [
            [Paragraph(f"<b>{fname}</b> — <font color='{ACCENT}'>{ftitle}</font>", h3_style)],
            [Paragraph(fdesc, body_style)]
        ]
        t = Table(p_box, colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t)
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Complete REST API Endpoint Catalog", h2_style))
    story.append(Paragraph(
        "Below is the complete reference table of RESTful API endpoints exposed by the Fixly backend Express server.",
        body_style
    ))
    story.append(Spacer(1, 6))

    api_headers = ["HTTP Method", "Endpoint URI", "Access Guard", "Description & Operation Details"]
    api_data = [
        [Paragraph(h, table_header_style) for h in api_headers],

        [Paragraph("<b>POST</b>", table_cell_code), Paragraph("/api/auth/register", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Register new customer or technician user account.", table_cell_style)],
        [Paragraph("<b>POST</b>", table_cell_code), Paragraph("/api/auth/login", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Authenticate user credentials & receive HTTP-Only JWT cookie.", table_cell_style)],
        [Paragraph("<b>POST</b>", table_cell_code), Paragraph("/api/auth/logout", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Clear authentication cookie & invalidate active session.", table_cell_style)],
        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/auth/me", table_cell_style), Paragraph("Protected", table_cell_style), Paragraph("Fetch authenticated user profile details.", table_cell_style)],

        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/services", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("List all 8 service categories with icons & slugs.", table_cell_style)],
        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/services/:slug", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Fetch single service category details by slug.", table_cell_style)],

        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/technicians", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Search & filter verified technicians by category, location, rating.", table_cell_style)],
        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/technicians/:id", table_cell_style), Paragraph("Public", table_cell_style), Paragraph("Fetch comprehensive technician profile, skills, & reviews.", table_cell_style)],

        [Paragraph("<b>POST</b>", table_cell_code), Paragraph("/api/requests", table_cell_style), Paragraph("Customer", table_cell_style), Paragraph("Submit a new service booking request with optional photos.", table_cell_style)],
        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/requests/customer", table_cell_style), Paragraph("Customer", table_cell_style), Paragraph("Fetch all service requests created by the authenticated customer.", table_cell_style)],
        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/requests/technician", table_cell_style), Paragraph("Technician", table_cell_style), Paragraph("Fetch job requests assigned to the authenticated technician.", table_cell_style)],
        [Paragraph("<b>PATCH</b>", table_cell_code), Paragraph("/api/requests/:id/accept", table_cell_style), Paragraph("Technician", table_cell_style), Paragraph("Technician accepts job request (status $\\rightarrow$ `ACCEPTED`).", table_cell_style)],
        [Paragraph("<b>PATCH</b>", table_cell_code), Paragraph("/api/requests/:id/start", table_cell_style), Paragraph("Technician", table_cell_style), Paragraph("Start active service job (status $\\rightarrow$ `IN_PROGRESS`).", table_cell_style)],
        [Paragraph("<b>PATCH</b>", table_cell_code), Paragraph("/api/requests/:id/complete", table_cell_style), Paragraph("Technician", table_cell_style), Paragraph("Mark service job complete (status $\\rightarrow$ `COMPLETED`).", table_cell_style)],

        [Paragraph("<b>POST</b>", table_cell_code), Paragraph("/api/reviews", table_cell_style), Paragraph("Customer", table_cell_style), Paragraph("Submit 5-star review for completed booking & recalculate ratings.", table_cell_style)],

        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/notifications", table_cell_style), Paragraph("Protected", table_cell_style), Paragraph("Fetch user notifications and unread message badge count.", table_cell_style)],
        [Paragraph("<b>PATCH</b>", table_cell_code), Paragraph("/api/notifications/read-all", table_cell_style), Paragraph("Protected", table_cell_style), Paragraph("Mark all user notifications as read.", table_cell_style)],

        [Paragraph("<b>GET</b>", table_cell_code), Paragraph("/api/admin/stats", table_cell_style), Paragraph("Admin", table_cell_style), Paragraph("Fetch MongoDB platform KPI statistics & completion rates.", table_cell_style)],
        [Paragraph("<b>PATCH</b>", table_cell_code), Paragraph("/api/admin/users/:id/status", table_cell_style), Paragraph("Admin", table_cell_style), Paragraph("Toggle user account between `ACTIVE` and `SUSPENDED`.", table_cell_style)],
        [Paragraph("<b>PATCH</b>", table_cell_code), Paragraph("/api/admin/technicians/:id/verify", table_cell_style), Paragraph("Admin", table_cell_style), Paragraph("Approve or reject technician verification application.", table_cell_style)],
        [Paragraph("<b>DELETE</b>", table_cell_code), Paragraph("/api/admin/reviews/:id", table_cell_style), Paragraph("Admin", table_cell_style), Paragraph("Moderate and delete inappropriate reviews with rating rollback.", table_cell_style)]
    ]

    api_table = Table(api_data, colWidths=[65, 125, 75, 239])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(api_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=SECONDARY, spaceBefore=10, spaceAfter=10))
    story.append(Paragraph(
        "<b>Document Completion Notice:</b> This document was programmatically compiled by Antigravity for Omkar Narsale. "
        "All code structures, schemas, credentials, and API routes accurately reflect the current Fixly repository workspace state.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {pdf_filename}")

if __name__ == '__main__':
    build_pdf()
