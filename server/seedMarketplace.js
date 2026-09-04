import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Technician from './models/Technician.js';

dotenv.config();

const initialServices = [
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Leak fixes, pipe fitting, bathroom repairs, and clog removals by certified plumbers.',
    icon: 'Wrench',
    category: 'Home Repair'
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    description: 'Wiring repair, MCB replacement, lighting installation, and short circuit diagnosis.',
    icon: 'Zap',
    category: 'Home Repair'
  },
  {
    name: 'Cleaning',
    slug: 'cleaning',
    description: 'Deep home cleaning, sofa & carpet shampooing, kitchen & bathroom sanitization.',
    icon: 'Sparkles',
    category: 'Cleaning'
  },
  {
    name: 'AC Repair',
    slug: 'ac-repair',
    description: 'Jet servicing, gas refill, cooling diagnostics, and compressor maintenance.',
    icon: 'Wind',
    category: 'Appliances'
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Custom woodworking, furniture repairs, door lock fitting, and modular assembly.',
    icon: 'Hammer',
    category: 'Home Repair'
  },
  {
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'Washing machine, refrigerator, microwave oven, and TV repair specialists.',
    icon: 'Tv',
    category: 'Appliances'
  },
  {
    name: 'Vehicle Service',
    slug: 'vehicle-service',
    description: 'On-demand doorstep bike & car mechanic servicing, battery jumpstart, & tyre repair.',
    icon: 'Car',
    category: 'Automotive'
  },
  {
    name: 'Home Maintenance',
    slug: 'home-maintenance',
    description: 'Painting, waterproofing coating, handyman assistance, and general home upkeep.',
    icon: 'Grid',
    category: 'Home Repair'
  }
];

const initialTechniciansData = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@fixly.com',
    phone: '+91 98765 11111',
    password: 'Password123',
    serviceSlug: 'plumbing',
    serviceCategory: 'Plumbing',
    bio: 'Certified master plumber with 6+ years of experience in high-pressure piping, drain unclogging, and fixture installation.',
    experienceYears: 6,
    skills: ['Pipe Fitting', 'Leak Detection', 'Tap Replacement', 'Bathroom Fitting'],
    location: 'Thane',
    serviceArea: ['Thane', 'Mulund', 'Kalwa'],
    hourlyRate: '₹800 – ₹1,200',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
    rating: 4.9,
    totalReviews: 142,
    verificationStatus: 'approved'
  },
  {
    name: 'Akash Patil',
    email: 'akash.patil@fixly.com',
    phone: '+91 98765 22222',
    password: 'Password123',
    serviceSlug: 'electrical',
    serviceCategory: 'Electrical',
    bio: 'Licensed electrical contractor specializing in heavy appliance connections, MCB tripping repair, and short circuit diagnosis.',
    experienceYears: 7,
    skills: ['MCB Tripping', 'House Re-wiring', 'Switchboard Repair', 'Geyser Connection'],
    location: 'Mumbai',
    serviceArea: ['Mumbai', 'Dadar', 'Bandra'],
    hourlyRate: '₹500 – ₹900',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    rating: 4.8,
    totalReviews: 118,
    verificationStatus: 'approved'
  },
  {
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@fixly.com',
    phone: '+91 98765 33333',
    password: 'Password123',
    serviceSlug: 'cleaning',
    serviceCategory: 'Cleaning',
    bio: 'Professional eco-friendly home & office deep cleaning expert equipped with steam sanitization equipment.',
    experienceYears: 5,
    skills: ['Deep Home Cleaning', 'Sofa Shampooing', 'Bathroom Sanitization', 'Kitchen Degreasing'],
    location: 'Thane',
    serviceArea: ['Thane', 'Navi Mumbai', 'Mulund'],
    hourlyRate: '₹999 – ₹1,800',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    rating: 4.9,
    totalReviews: 186,
    verificationStatus: 'approved'
  },
  {
    name: 'Suresh Verma',
    email: 'suresh.verma@fixly.com',
    phone: '+91 98765 44444',
    password: 'Password123',
    serviceSlug: 'ac-repair',
    serviceCategory: 'AC Repair',
    bio: 'HVAC specialist skilled in split & inverter AC jet washing, gas leakage fixing, and compressor diagnostics.',
    experienceYears: 8,
    skills: ['Jet Servicing', 'Gas Charging R32/R410', 'PCB Diagnostics', 'AC Installation'],
    location: 'Mulund',
    serviceArea: ['Mulund', 'Thane', 'Ghatkopar'],
    hourlyRate: '₹600 – ₹1,500',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    rating: 4.9,
    totalReviews: 215,
    verificationStatus: 'approved'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.carpenter@fixly.com',
    phone: '+91 98765 55555',
    password: 'Password123',
    serviceSlug: 'carpentry',
    serviceCategory: 'Carpentry',
    bio: 'Master craftsman for wooden furniture repairs, modular door alignment, custom shelves, and lock fittings.',
    experienceYears: 6,
    skills: ['Modular Furniture Repair', 'Door Lock Fitting', 'Cabinet Repair', 'Custom Shelves'],
    location: 'Kalyan',
    serviceArea: ['Kalyan', 'Dombivli', 'Thane'],
    hourlyRate: '₹700 – ₹1,400',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    rating: 4.7,
    totalReviews: 94,
    verificationStatus: 'approved'
  },
  {
    name: 'Deepak Sawant',
    email: 'deepak.mechanic@fixly.com',
    phone: '+91 98765 66666',
    password: 'Password123',
    serviceSlug: 'vehicle-service',
    serviceCategory: 'Vehicle Service',
    bio: 'Doorstep vehicle mechanic providing battery jumpstarts, oil changes, engine tuning, and emergency breakdown repairs.',
    experienceYears: 5,
    skills: ['Battery Jumpstart', 'Car General Service', 'Bike Engine Tuning', 'Flat Tyre Repair'],
    location: 'Mumbai',
    serviceArea: ['Mumbai', 'Thane', 'Navi Mumbai'],
    hourlyRate: '₹499 – ₹1,200',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    rating: 4.8,
    totalReviews: 128,
    verificationStatus: 'approved'
  },
  {
    name: 'Vikas Shinde (Pending Approval)',
    email: 'vikas.pending@fixly.com',
    phone: '+91 98765 77777',
    password: 'Password123',
    serviceSlug: 'plumbing',
    serviceCategory: 'Plumbing',
    bio: 'Experienced plumber applying for Fixly verification.',
    experienceYears: 4,
    skills: ['Pipe Leakage', 'Water Tank Cleaning'],
    location: 'Thane',
    serviceArea: ['Thane'],
    hourlyRate: '₹600 – ₹1,000',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    rating: 0,
    totalReviews: 0,
    verificationStatus: 'pending'
  }
];

const seedMarketplace = async () => {
  try {
    await connectDB();

    console.log('[Seed Marketplace] Seeding Service categories...');
    const createdServicesMap = {};

    for (const sData of initialServices) {
      let service = await Service.findOne({ slug: sData.slug });
      if (!service) {
        service = await Service.create(sData);
      }
      createdServicesMap[sData.slug] = service;
    }

    console.log('[Seed Marketplace] Seeding Technicians & Users...');
    for (const tData of initialTechniciansData) {
      let user = await User.findOne({ email: tData.email });
      if (!user) {
        user = await User.create({
          name: tData.name,
          email: tData.email,
          phone: tData.phone,
          password: tData.password,
          role: 'technician'
        });
      }

      const matchingService = createdServicesMap[tData.serviceSlug];
      const serviceIds = matchingService ? [matchingService._id] : [];

      let techProfile = await Technician.findOne({ userId: user._id });
      if (!techProfile) {
        await Technician.create({
          userId: user._id,
          serviceCategory: tData.serviceCategory,
          serviceIds,
          bio: tData.bio,
          experienceYears: tData.experienceYears,
          skills: tData.skills,
          location: tData.location,
          serviceArea: tData.serviceArea,
          hourlyRate: tData.hourlyRate,
          availability: true,
          profileImage: tData.avatar,
          rating: tData.rating,
          totalReviews: tData.totalReviews,
          verificationStatus: tData.verificationStatus
        });
      } else {
        techProfile.serviceIds = serviceIds;
        techProfile.verificationStatus = tData.verificationStatus;
        await techProfile.save();
      }
    }

    console.log('[Seed Marketplace] Seeding Demo Customer...');
    let customerUser = await User.findOne({ email: 'vijay@fixnear.com' });
    if (!customerUser) {
      await User.create({
        name: 'Vijay Sharma',
        email: 'vijay@fixnear.com',
        phone: '+91 98765 00000',
        password: 'Password123',
        role: 'customer'
      });
    }

    console.log('[Seed Marketplace] Successfully seeded services, technicians, and customer!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Marketplace Error] ${error.message}`);
    process.exit(1);
  }
};

seedMarketplace();
