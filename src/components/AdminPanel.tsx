import React, { useState, useEffect } from 'react';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Project } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { extractImageUrl } from '../lib/hooks';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState<'residential' | 'commercial' | 'renovation' | 'kitchen&bath' | 'office design'>('residential');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [aspectRatio, setAspectRatio] = useState('aspect-square');
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [showInCarousel, setShowInCarousel] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else {
        setError('One of the selected files is not a valid image');
      }
    }
    
    setGalleryFiles(prev => [...prev, ...newFiles]);
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, idx) => idx !== index));
    setGalleryPreviews(prev => prev.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const q = collection(db, 'projects');
        const snapshot = await getDocs(q);
        const projData: Project[] = [];
        snapshot.forEach((doc) => {
          projData.push({ id: doc.id, ...doc.data() } as Project);
        });
        setProjects(projData);
        setLoading(false);
      } catch (err) {
        handleFirestoreError(err as Error, OperationType.GET, 'projects');
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Upload image to Firebase Storage
      const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Upload multiple gallery images to Firebase Storage
      const galleryUrls: string[] = [];
      for (const file of galleryFiles) {
        const fileRef = ref(storage, `projects/gallery_${Date.now()}_${file.name}`);
        const fileSnapshot = await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileSnapshot.ref);
        galleryUrls.push(fileUrl);
      }

      // 3. Save project to Firestore
      await addDoc(collection(db, 'projects'), {
        title,
        subtitle,
        image: downloadURL,
        galleryImages: galleryUrls,
        category,
        description,
        location,
        year,
        aspectRatio,
        isFeatured,
        showInCarousel,
        createdAt: Date.now()
      });
      // Reset form
      setTitle('');
      setSubtitle('');
      setImageFile(null);
      setImagePreview('');
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setDescription('');
      setLocation('');
      setIsFeatured(true);
      setShowInCarousel(false);
    } catch (err: any) {
      setError(err.message || "Failed to add project.");
      try {
        handleFirestoreError(err, OperationType.CREATE, 'projects');
      } catch(e) {}
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete project.");
      try {
        handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
      } catch(e) {}
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-forest-deep/96 z-[200] flex items-center justify-center p-4">
        <div className="text-paper-white font-serif">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-forest-deep/96 z-[200] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-cream-soft rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative my-auto shadow-2xl">
        <div className="p-6 border-b border-sage-muted/20 flex justify-between items-center bg-paper-white">
          <h2 className="font-serif text-2xl text-forest-deep tracking-wider">Admin Panel</h2>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-sage-muted/10 transition-colors text-forest-deep">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Form Section */}
            <div className="bg-paper-white p-6 rounded-xl border border-sage-muted/20 h-max">
              <h3 className="font-serif text-xl border-b border-sage-muted/20 pb-4 mb-4 text-forest-deep tracking-wide flex items-center justify-between">
                Add New Project
              </h3>
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-sans break-words">{error}</div>}
              
              <form onSubmit={handleAddProject} className="space-y-4 font-sans text-forest-deep">
                <div>
                  <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Subtitle</label>
                  <input required value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full p-2.5 rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Cover Image (Main Showcase)</label>
                  <input required type="file" accept=".jpg,.jpeg,image/jpeg,image/png,image/webp" onChange={handleImageChange} className="w-full p-2 text-sm rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-forest-deep/10 file:text-forest-deep hover:file:bg-forest-deep/20" />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg border border-sage-muted/20" />}
                </div>

                <div>
                  <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Additional Gallery Images</label>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full p-2 text-sm rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-forest-deep/10 file:text-forest-deep hover:file:bg-forest-deep/20" />
                  {galleryPreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-2 bg-cream-soft/50 rounded-lg border border-sage-muted/10 max-h-32 overflow-y-auto w-full">
                      {galleryPreviews.map((prev, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded overflow-hidden border border-sage-muted/20 flex-shrink-0">
                          <img src={prev} alt={`Gallery Preview ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryFile(idx)}
                            className="absolute inset-0 bg-red-600/70 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity select-none"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 py-2 border-y border-sage-muted/10">
                  <input 
                    type="checkbox" 
                    id="isFeatured" 
                    checked={isFeatured} 
                    onChange={e => setIsFeatured(e.target.checked)} 
                    className="w-4 h-4 text-forest-deep bg-cream-soft border-sage-muted/30 rounded focus:ring-forest-deep focus:ring-2"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-label-caps uppercase tracking-widest text-forest-deep/80 cursor-pointer">
                    Feature on Home Page
                  </label>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-sage-muted/10">
                  <input 
                    type="checkbox" 
                    id="showInCarousel" 
                    checked={showInCarousel} 
                    onChange={e => setShowInCarousel(e.target.checked)} 
                    className="w-4 h-4 text-forest-deep bg-cream-soft border-sage-muted/30 rounded focus:ring-forest-deep focus:ring-2"
                  />
                  <label htmlFor="showInCarousel" className="text-sm font-label-caps uppercase tracking-widest text-forest-deep/80 cursor-pointer">
                    Add to Hero Carousel
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2.5 rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors">
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="renovation">Renovation</option>
                      <option value="kitchen&bath">Kitchen & Bath</option>
                      <option value="office design">Office Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Aspect Ratio</label>
                    <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as string)} className="w-full p-2.5 rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors">
                      <option value="aspect-square">Square</option>
                      <option value="aspect-[4/5]">Portrait (4/5)</option>
                      <option value="aspect-[3/4]">Portrait (3/4)</option>
                      <option value="aspect-video">Landscape (16/9)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Location</label>
                    <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2.5 rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Year</label>
                    <input required value={year} onChange={e => setYear(e.target.value)} className="w-full p-2.5 rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-label-caps uppercase tracking-widest text-forest-deep/70 mb-1">Description</label>
                  <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2.5 rounded-lg border border-sage-muted/20 bg-cream-soft focus:outline-none focus:border-forest-deep/50 transition-colors resize-none" />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-forest-deep text-paper-white py-3 rounded-lg flex items-center justify-center gap-2 font-label-caps tracking-widest hover:bg-forest-deep/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : <><Plus size={18} /> Add Project</>}
                </button>
              </form>
            </div>

            {/* List Section */}
            <div className="flex flex-col gap-4 overflow-hidden h-full">
              <h3 className="font-serif text-xl border-b border-sage-muted/20 pb-4 text-forest-deep tracking-wide flex-shrink-0">
                Manage Projects ({projects.length})
              </h3>
              <div className="overflow-y-auto space-y-3 pr-2 h-full pb-8">
                {projects.map(proj => (
                  <div key={proj.id} className="flex gap-4 p-3 bg-paper-white border border-sage-muted/20 rounded-xl items-center shadow-sm">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-soft flex-shrink-0 border border-sage-muted/10">
                      {proj.image && (
                        <img 
                          src={extractImageUrl(proj.image)} 
                          alt={proj.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-forest-deep truncate">{proj.title}</div>
                      <div className="font-sans text-xs text-forest-deep/70 truncate">{proj.subtitle} • {proj.location}</div>
                    </div>
                    <button 
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center p-8 bg-paper-white/50 rounded-xl border border-dashed border-sage-muted/30 text-forest-deep/50 font-sans">
                    No projects found. Add one to get started.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
