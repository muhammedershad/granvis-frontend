import type { Payment, Project, ScheduleItem, TimelineItem } from "./types";

// Mock data - in a real app, this would come from your API
export const mockProject: Project = {
  id: "1",
  name: "Modern Villa Residence",
  description:
    "Luxury 4-bedroom villa with contemporary design and sustainable features including solar panels, rainwater harvesting, and energy-efficient systems. The project focuses on creating a seamless indoor-outdoor living experience with open spaces, natural lighting, and premium finishes.",
  client: {
    id: "1",
    name: "John & Sarah Williams",
    email: "williams@email.com",
    phone: "+1 (555) 123-4567",
    company: "Williams Family Trust",
    address: "123 Hillcrest Drive, Beverly Hills, CA 90210",
  },
  type: "Villa",
  category: "Luxury Residential",
  status: "In Progress",
  priority: "High",
  startDate: "2024-01-15",
  endDate: "2024-08-30",
  deadline: "2024-09-15",
  progressPercentage: 65,
  currentPhase: "Interior Construction",
  projectManager: "John Doe",
  teamMembers: ["Sarah Johnson", "Michael Chen", "Amanda Lee"],
  location: {
    address: "123 Hillcrest Drive",
    city: "Beverly Hills",
    state: "CA",
    country: "USA",
  },
  budget: {
    total: 850000,
    spent: 420000,
    remaining: 430000,
  },
  tags: ["Luxury", "Sustainable", "Contemporary"],
};

export const mockTimeline: TimelineItem[] = [
  {
    id: "1",
    title: "Project Initiation & Site Survey",
    description:
      "Initial site visit, measurements, and feasibility study completed. Soil testing and utility mapping done.",
    status: "completed",
    assignedTo: "John Doe",
    assignedBy: "Emily Rodriguez",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    completedDate: "2024-01-21",
    category: "design",
    attachments: ["site-survey.pdf", "soil-report.pdf"],
    comments: [
      {
        id: "1",
        author: "John Doe",
        message:
          "Site survey completed successfully. Found some drainage issues that need addressing.",
        timestamp: "2024-01-21T10:30:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Conceptual Design Development",
    description:
      "Creating initial design concepts, floor plans, and 3D visualizations based on client requirements.",
    status: "completed",
    assignedTo: "Sarah Johnson",
    assignedBy: "John Doe",
    startDate: "2024-01-23",
    endDate: "2024-02-15",
    completedDate: "2024-02-14",
    category: "design",
    attachments: ["concept-designs.pdf", "3d-renders.zip"],
    comments: [
      {
        id: "2",
        author: "Sarah Johnson",
        message:
          "Presented 3 concept options to client. They preferred option B with some modifications.",
        timestamp: "2024-02-14T14:20:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Building Permit Application",
    description:
      "Preparing and submitting building permit application to local authorities with detailed drawings.",
    status: "completed",
    assignedTo: "Michael Chen",
    assignedBy: "John Doe",
    startDate: "2024-02-16",
    endDate: "2024-03-01",
    completedDate: "2024-02-28",
    category: "approval",
    attachments: ["permit-application.pdf", "technical-drawings.dwg"],
  },
  {
    id: "4",
    title: "Foundation Excavation",
    description:
      "Site preparation and foundation excavation according to approved plans and specifications.",
    status: "completed",
    assignedTo: "Construction Team A",
    assignedBy: "John Doe",
    startDate: "2024-03-15",
    endDate: "2024-03-30",
    completedDate: "2024-03-29",
    category: "construction",
  },
  {
    id: "5",
    title: "Structural Framework",
    description:
      "Steel and concrete structural work including columns, beams, and floor slabs.",
    status: "completed",
    assignedTo: "Construction Team B",
    assignedBy: "John Doe",
    startDate: "2024-04-01",
    endDate: "2024-05-15",
    completedDate: "2024-05-14",
    category: "construction",
  },
  {
    id: "6",
    title: "Interior Construction Phase 1",
    description:
      "Electrical, plumbing, and HVAC rough-in work. Installation of interior walls and insulation.",
    status: "in-progress",
    assignedTo: "Construction Team C",
    assignedBy: "John Doe",
    startDate: "2024-05-16",
    endDate: "2024-07-15",
    category: "construction",
    comments: [
      {
        id: "3",
        author: "Construction Team C",
        message:
          "Electrical work 80% complete. HVAC installation starts next week.",
        timestamp: "2024-06-15T09:15:00Z",
      },
    ],
  },
  {
    id: "7",
    title: "Interior Finishes & Fixtures",
    description:
      "Installation of flooring, painting, kitchen cabinets, bathroom fixtures, and final finishes.",
    status: "pending",
    assignedTo: "Interior Team",
    assignedBy: "Sarah Johnson",
    startDate: "2024-07-16",
    endDate: "2024-08-30",
    category: "construction",
  },
  {
    id: "8",
    title: "Final Inspection & Handover",
    description:
      "Final quality inspection, client walkthrough, and project handover with documentation.",
    status: "pending",
    assignedTo: "John Doe",
    assignedBy: "Emily Rodriguez",
    startDate: "2024-09-01",
    endDate: "2024-09-15",
    category: "delivery",
  },
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: "1",
    title: "Client Progress Review Meeting",
    description:
      "Monthly progress review with clients to discuss current status and upcoming phases",
    startDate: "2024-07-15T10:00:00Z",
    endDate: "2024-07-15T11:30:00Z",
    type: "meeting",
    attendees: ["John Doe", "Sarah Johnson", "John Williams", "Sarah Williams"],
    location: "Project Site Office",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Electrical System Final Inspection",
    description:
      "Final inspection of electrical installations by certified inspector",
    startDate: "2024-07-20T14:00:00Z",
    endDate: "2024-07-20T16:00:00Z",
    type: "review",
    attendees: ["Michael Chen", "Electrical Inspector"],
    location: "Project Site",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Interior Design Milestone",
    description: "Complete interior design selections and finalization",
    startDate: "2024-07-25T09:00:00Z",
    endDate: "2024-07-25T17:00:00Z",
    type: "milestone",
    attendees: ["Sarah Johnson", "Interior Designer"],
    status: "scheduled",
  },
];

export const mockPayments: Payment[] = [
  {
    id: "1",
    amount: 170000,
    type: "advance",
    status: "paid",
    dueDate: "2024-01-20",
    paidDate: "2024-01-18",
    description: "Project advance payment (20%)",
    invoiceNumber: "INV-2024-001",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "2",
    amount: 255000,
    type: "milestone",
    status: "paid",
    dueDate: "2024-04-15",
    paidDate: "2024-04-12",
    description: "Foundation & Structure completion (30%)",
    invoiceNumber: "INV-2024-002",
    paymentMethod: "Check",
  },
  {
    id: "3",
    amount: 170000,
    type: "milestone",
    status: "pending",
    dueDate: "2024-07-30",
    description: "Interior construction phase completion (20%)",
    invoiceNumber: "INV-2024-003",
  },
  {
    id: "4",
    amount: 255000,
    type: "final",
    status: "pending",
    dueDate: "2024-09-15",
    description: "Final payment upon project completion (30%)",
    invoiceNumber: "INV-2024-004",
  },
];
