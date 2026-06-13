import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Project } from '../types';

export function extractImageUrl(image: any): string | null {
  if (!image || typeof image !== 'string') return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const match = image.match(/src=["'](.*?)["']/);
  return match ? match[1] : (image || null);
}

const SEED_PROJECTS = [
  {
    title: "CHANDI ATELIER",
    subtitle: "Hand-sculpted Silver Chamber",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    category: "commercial" as const,
    description: "An experiential preview theatre and private atelier. Features micro-textured silver-painted lime wash walls, raw basalt stone plinths, and circular skylights designed to isolate direct daylight onto single objects.",
    location: "Colaba, Mumbai",
    year: "2025",
    aspectRatio: "aspect-[4/3]",
    isFeatured: true,
    showInCarousel: true,
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    title: "LINEN LIVING CHAMBER",
    subtitle: "Soft Restorative Biophilic Parlour",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    category: "residential" as const,
    description: "A private lounge prioritizing clean acoustic flow, natural air convection, and non-bleached linen drapery. Warm custom-cut oak planks line the flooring, illuminated by a suspended rice-paper pendant.",
    location: "Jubilee Hills, Hyderabad",
    year: "2026",
    aspectRatio: "aspect-square",
    isFeatured: true,
    showInCarousel: true,
    galleryImages: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    title: "IKAT ALCOVE",
    subtitle: "Bespoke Read-and-Reset Library",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    category: "renovation" as const,
    description: "Detailed millwork combining raw brass accents with custom hand-carved heritage teak panels. Designed around a restored arched window to cultivate direct sensory focus and reading comfort.",
    location: "Koregaon Park, Pune",
    year: "2024",
    aspectRatio: "aspect-[3/4]",
    isFeatured: true,
    showInCarousel: false,
    galleryImages: []
  },
  {
    title: "ALAKNANDA SUITE",
    subtitle: "Floating Solitary Marble Spa",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    category: "kitchen&bath" as const,
    description: "A sanctuary constructed with monolithic blocks of Makrana marble, integrated heated volcanic stone benches, and a custom rain-simulation biophilic ceiling.",
    location: "Rishikesh, Uttarakhand",
    year: "2026",
    aspectRatio: "aspect-[4/3]",
    isFeatured: true,
    showInCarousel: false,
    galleryImages: []
  },
  {
    title: "GIRI EXECUTIVE CABIN",
    subtitle: "High-Focus Minimalist Workspace",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    category: "office design" as const,
    description: "Clean lines, acoustic walls lined with wool felt panels, and custom sit-to-stand table carved from a single slab of solid walnut. Hidden integrated wiring channels preserve absolute visual hygiene.",
    location: "Whitefield, Bengaluru",
    year: "2025",
    aspectRatio: "aspect-square",
    isFeatured: true,
    showInCarousel: true,
    galleryImages: []
  }
];

async function seedInitialProjects() {
  console.log("Seeding database with default projects...");
  const collRef = collection(db, 'projects');
  try {
    for (let i = 0; i < SEED_PROJECTS.length; i++) {
      const p = SEED_PROJECTS[i];
      await addDoc(collRef, {
        ...p,
        createdAt: Date.now() - (i * 60000)
      });
    }
    console.log("Database successfully seeded.");
  } catch (err) {
    console.error("Failed to seed database: ", err);
  }
}

export function useFirebaseProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = sessionStorage.getItem('firebaseProjectsCache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('firebaseProjectsCache');
    } catch {
      return true;
    }
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = collection(db, 'projects');
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          seedInitialProjects();
          return;
        }
        const projData: Project[] = [];
        snapshot.forEach((doc) => {
          projData.push({ id: doc.id, ...doc.data() } as Project);
        });
        const toMs = (v: any) => {
          if (!v) return 0;
          if (typeof v === 'number') return v;
          if (typeof v.toMillis === 'function') return v.toMillis();
          return 0;
        };
        projData.sort((a: any, b: any) => toMs(b.createdAt) - toMs(a.createdAt));
        
        try {
          sessionStorage.setItem('firebaseProjectsCache', JSON.stringify(projData));
        } catch (e) {
          // Silently handle if storage is not available or quota exceeded
        }
        
        setProjects(projData);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
        try {
          handleFirestoreError(err as Error, OperationType.GET, 'projects');
        } catch(e) {}
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
