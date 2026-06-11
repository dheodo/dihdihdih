export interface Project {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  galleryImages?: string[];
  category: 'residential' | 'commercial' | 'renovation' | 'kitchen&bath' | 'office design' | 'all';
  description: string;
  location: string;
  year: string;
  aspectRatio: string; // e.g. "aspect-square", "aspect-[3/4]"
  marginClass?: string; // for custom layout offset spacing
  isFeatured?: boolean;
  showInCarousel?: boolean;
}

export interface ServiceClass {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export interface Belief {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface LeadInquiry {
  email: string;
  name?: string;
  phone?: string;
  serviceOfInterest?: string;
  message?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  projectTitle: string;
  rating: number;
  date?: string;
  image?: string;
}

