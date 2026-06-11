import { Project, ServiceClass, Belief, Testimonial } from './types';

export const IMAGES = {
  heroBg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  imaginationGrid: [
    "/assets/images/mumbai_highrise_lounge_1779870430720.png",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
    "/assets/images/modern_kitchen_pantry_1779870582110.png",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80"
  ]
};

export const BELIEFS: Belief[] = [
  {
    id: "craftsmanship",
    title: "Craftsmanship",
    description: "Every detail reflects quality, precision, and creativity, shaping interiors built to last with high-end premium custom millwork and handpicked textiles.",
    iconName: "Wrench"
  },
  {
    id: "collaboration",
    title: "Collaboration",
    description: "We design through authentic dialogue, turning personal philosophies and client blueprints into bespoke physical and emotional spatial realities.",
    iconName: "Users"
  },
  {
    id: "sustainability",
    title: "Sustainability",
    description: "Architectural responsibility is at our core—optimizing energy flow, sourcing materials mindfully, and ensuring longevity in every build.",
    iconName: "Recycle"
  }
];

export const SERVICES: ServiceClass[] = [
  {
    id: "residential-design",
    title: "Residential Curation",
    description: "We design refined, functional living spaces that blend comfort, light, and organic texture to create homes that truly reflect private individual lifestyles.",
    tags: ["Apartment", "Villa", "Modern Homes", "Bespoke Lighting"],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "commercial-spaces",
    title: "Commercial Spaces",
    description: "From open collaboration workspaces to bespoke boutique hotels and high-end restaurant hubs, we craft settings that stimulate productivity, connectivity, and branding identity.",
    tags: ["Offices", "Cafés", "Restaurants", "Showrooms"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "renovation-remodeling",
    title: "Renovation & Remodeling",
    description: "Breathing new soul into historic structural grids. Transform your current property layout with innovative spatial flow mapping, custom furniture sourcing, and material palettes.",
    tags: ["Remodeling", "Upgrades", "Acoustics", "Space Planning"],
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
  }
];

export const TRUSTED_COMPANIES = ["Studio Nordikus", "Lignum & Linum", "Forma Atelier", "Atrium Group", "ArchiElement"];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    quote: "The way Maintenance Masters balances silent architectural gravity with soft biophilic layers completely transformed our family rhythm. Our central Angan courtyard feels like a living, breathing sanctuary first, and a luxury home second.",
    author: "Ananya Sharma",
    role: "Art Curator & Homeowner",
    projectTitle: "The Angan Courtyard",
    rating: 5,
    date: "Apr 18, 2026",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "testimonial-3",
    quote: "Our boutique showroom required a layout that felt highly artistic yet fully functional. Maintenance Masters designed an intuitive flow that makes our silver pieces feel like historic museum artifacts.",
    author: "Vikram Singh",
    role: "Retail Showcase Director",
    projectTitle: "Mumbai Silverware",
    rating: 5,
    date: "Mar 24, 2026",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "testimonial-4",
    quote: "They don't just decorate; they construct architectural storylines. Every material is calibrated for tactile quality, natural air circulation, and solar alignment. It's a masterclass in modern sustainability.",
    author: "Meera Iyer",
    role: "Biophilic Advocate & Developer",
    projectTitle: "The Terra House",
    rating: 5,
    date: "May 15, 2026",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "testimonial-5",
    quote: "Great experience overall, very thoughtful design. The aesthetic matched my vision perfectly.",
    author: "Rahul S.",
    role: "Homeowner",
    projectTitle: "Minimalist Apartment",
    rating: 4,
    date: "May 20, 2026",
    image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=400&q=80"
  }
];
