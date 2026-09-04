// Centralized mock data for Fixly platform

export const mockServices = [
  {
    id: 'plumbing',
    slug: 'plumbing',
    name: 'Plumbing',
    icon: 'Wrench',
    description: 'Leak fixes, pipe fitting, bathroom repairs, and clog removals by certified plumbers.',
    popularCount: 182,
    startingPrice: '₹499',
    badge: 'High Demand'
  },
  {
    id: 'electrical',
    slug: 'electrical',
    name: 'Electrical',
    icon: 'Zap',
    description: 'Wiring repair, MCB replacement, lighting installation, and short circuit diagnosis.',
    popularCount: 210,
    startingPrice: '₹399',
    badge: 'Popular'
  },
  {
    id: 'cleaning',
    slug: 'cleaning',
    name: 'Cleaning',
    icon: 'Sparkles',
    description: 'Deep home cleaning, sofa & carpet shampooing, kitchen & bathroom sanitization.',
    popularCount: 195,
    startingPrice: '₹799',
    badge: 'Top Rated'
  },
  {
    id: 'ac-repair',
    slug: 'ac-repair',
    name: 'AC Repair',
    icon: 'Wind',
    description: 'Jet servicing, gas refill, cooling diagnostics, and compressor maintenance.',
    popularCount: 245,
    startingPrice: '₹599'
  },
  {
    id: 'carpentry',
    slug: 'carpentry',
    name: 'Carpentry',
    icon: 'Hammer',
    description: 'Custom woodworking, furniture repairs, door lock fitting, and modular assembly.',
    popularCount: 115,
    startingPrice: '₹450'
  },
  {
    id: 'appliance-repair',
    slug: 'appliance-repair',
    name: 'Appliance Repair',
    icon: 'Tv',
    description: 'Washing machine, refrigerator, microwave oven, and TV repair specialists.',
    popularCount: 138,
    startingPrice: '₹349'
  },
  {
    id: 'vehicle-service',
    slug: 'vehicle-service',
    name: 'Vehicle Service',
    icon: 'Car',
    description: 'On-demand doorstep bike & car mechanic servicing, battery jumpstart, & tyre repair.',
    popularCount: 92,
    startingPrice: '₹499',
    badge: 'New'
  },
  {
    id: 'home-maintenance',
    slug: 'home-maintenance',
    name: 'Home Maintenance',
    icon: 'Grid',
    description: 'Painting, waterproofing coating, handyman assistance, and general home upkeep.',
    popularCount: 160,
    startingPrice: '₹899'
  }
];

export const mockProfessionals = [
  {
    id: 'pro-1',
    name: 'Rahul Kumar',
    service: 'Plumber',
    serviceCategory: 'plumbing',
    rating: 4.9,
    reviewsCount: 142,
    experienceYears: 6,
    location: '2.1 km away • Thane',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
    verified: true,
    hourlyRate: '₹800 – ₹1,200',
    completedJobs: 184,
    availableNow: true,
    bio: 'Certified master plumber specializing in high-pressure pipe leaks, tap replacement, and fixture installation.'
  },
  {
    id: 'pro-2',
    name: 'Akash Patil',
    service: 'Electrician',
    serviceCategory: 'electrical',
    rating: 4.8,
    reviewsCount: 118,
    experienceYears: 7,
    location: '3.4 km away • Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    verified: true,
    hourlyRate: '₹500 – ₹900',
    completedJobs: 230,
    availableNow: true,
    bio: 'Licensed electrical contractor specializing in heavy appliance connections, MCB trippings, and re-wiring.'
  },
  {
    id: 'pro-3',
    name: 'Priya Services',
    service: 'Home Cleaning',
    serviceCategory: 'cleaning',
    rating: 4.9,
    reviewsCount: 186,
    experienceYears: 5,
    location: '1.8 km away • Thane',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    verified: true,
    hourlyRate: '₹999 – ₹1,800',
    completedJobs: 290,
    availableNow: true,
    bio: 'Professional eco-friendly home & office deep cleaning expert equipped with industrial steam sanitizers.'
  },
  {
    id: 'pro-4',
    name: 'Suresh Verma',
    service: 'AC Technician',
    serviceCategory: 'ac-repair',
    rating: 4.9,
    reviewsCount: 215,
    experienceYears: 8,
    location: '4.2 km away • Mulund',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    verified: true,
    hourlyRate: '₹600 – ₹1,500',
    completedJobs: 340,
    availableNow: true,
    bio: 'HVAC specialist skilled in split & inverter AC servicing, gas charging, and compressor diagnostics.'
  },
  {
    id: 'pro-5',
    name: 'Rajesh Kumar',
    service: 'Carpenter',
    serviceCategory: 'carpentry',
    rating: 4.7,
    reviewsCount: 94,
    experienceYears: 6,
    location: '5.0 km away • Kalyan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    verified: true,
    hourlyRate: '₹700 – ₹1,400',
    completedJobs: 145,
    availableNow: true,
    bio: 'Expert carpenter for wooden furniture alignment, lock repairs, and modular kitchen installations.'
  },
  {
    id: 'pro-6',
    name: 'Deepak Sawant',
    service: 'Vehicle Mechanic',
    serviceCategory: 'vehicle-service',
    rating: 4.8,
    reviewsCount: 128,
    experienceYears: 5,
    location: '3.0 km away • Mumbai',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    verified: true,
    hourlyRate: '₹499 – ₹1,200',
    completedJobs: 176,
    availableNow: true,
    bio: 'Doorstep vehicle mechanic providing battery replacement, oil change, and emergency roadside repairs.'
  }
];

export const mockCustomerBookings = {
  stats: {
    activeBookings: 1,
    pendingRequests: 2,
    completedServices: 14
  },
  currentBooking: {
    id: 'FX-2026-90',
    service: 'Plumbing Repair',
    technicianName: 'Rahul Kumar',
    technicianAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
    technicianPhone: '+91 98765 43210',
    status: 'Accepted',
    date: 'Today',
    time: '5:00 PM',
    location: '2.1 km away • Thane West',
    problem: 'Kitchen sink drain leak and faucet replacement.',
    estimatedCost: '₹800 – ₹1,200'
  },
  recentBookings: [
    {
      id: 'FX-2026-88',
      service: 'AC Servicing & Cleaning',
      technicianName: 'Suresh Verma',
      status: 'Completed',
      date: '02 August 2026',
      time: '11:00 AM',
      amount: '₹850',
      ratingGiven: 5
    },
    {
      id: 'FX-2026-81',
      service: 'Electrical Switch Replacement',
      technicianName: 'Akash Patil',
      status: 'Completed',
      date: '24 July 2026',
      time: '03:30 PM',
      amount: '₹600',
      ratingGiven: 4.9
    }
  ]
};

export const mockTechnicianDashboardData = {
  stats: {
    newRequests: 3,
    acceptedJobs: 2,
    completedJobs: 184,
    averageRating: '4.9 ★'
  },
  requests: [
    {
      id: 'REQ-901',
      customerName: 'Vijay Narsale',
      service: 'Plumbing',
      problem: 'Kitchen Sink Repair & Drain Pipe Leakage',
      date: 'Today',
      time: '5:00 PM',
      location: '2.4 km away • Thane West',
      urgent: true,
      estimatedHours: '1 - 2 hrs',
      estimatedPrice: '₹800 – ₹1,200'
    },
    {
      id: 'REQ-902',
      customerName: 'Sunita Rao',
      service: 'Plumbing',
      problem: 'Bathroom pipe clog and valve rubber washer damage',
      date: 'Tomorrow',
      time: '10:00 AM',
      location: '3.8 km away • Mulund',
      urgent: false,
      estimatedHours: '1 hr',
      estimatedPrice: '₹500 – ₹800'
    }
  ],
  activeJobs: [
    {
      id: 'ACT-401',
      customerName: 'Meena Kulkarni',
      service: 'Overhead Tank Pipe Repair',
      scheduledDate: 'Today, 6:30 PM',
      location: '1.5 km away • Panchpakhadi, Thane',
      status: 'In Progress',
      phone: '+91 99201 12345'
    }
  ]
};

export const mockStatistics = [
  { value: '10K+', label: 'Successful Bookings' },
  { value: '2K+', label: 'Verified Professionals' },
  { value: '4.8/5', label: 'Average Customer Rating' },
  { value: '24/7', label: 'Service Requests' }
];

export const mockHowItWorksSteps = [
  {
    step: '01',
    title: 'Tell us what you need',
    description: 'Select a service category and describe the problem you need help with in seconds.'
  },
  {
    step: '02',
    title: 'Choose your professional',
    description: 'Compare verified professionals based on ratings, distance, pricing, and availability.'
  },
  {
    step: '03',
    title: 'Get it done',
    description: 'Book your professional, track service arrival, and get your problem resolved hassle-free.'
  }
];
