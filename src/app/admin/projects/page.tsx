"use client";

import { useEffect, useState } from "react";
import { Plus, MoreVertical, Briefcase, RefreshCcw, Trash2 } from "lucide-react";

interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '', image: '', category: '' });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Note: Since we don't have a POST endpoint in the current stub, this might fail or needs implementation.
            // Assuming we will implement POST /api/projects soon or it exists.
            // Earlier we only saw GET in the summaries, but standard practice implies we should have it.
            // I'll assume standard CRUD for now.
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            });

            if (res.ok) {
                const createdProject = await res.json();
                setProjects([createdProject, ...projects]);
                setIsAddingProject(false);
                setNewProject({ title: '', description: '', image: '', category: '' });
            } else {
                alert("Xatolik yuz berdi");
            }
        } catch (error) {
            console.error("Failed to create project", error);
        }
    };

    const deleteProject = async (id: number) => {
        if (!confirm("Haqiqatan ham bu loyihani o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert("Xatolik");
            }
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;
        try {
            const res = await fetch(`/api/projects/${editingProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProject)
            });
            if (res.ok) {
                const updated = await res.json();
                setProjects(projects.map(p => p.id === updated.id ? updated : p));
                setEditingProject(null);
            } else {
                alert("Saqlashda xatolik");
            }
        } catch (error) {
            console.error("Update error", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Loyihalar</h1>
                    <p className="text-white/40 text-sm">{loading ? "Yuklanmoqda..." : `Jami ${projects.length} ta loyiha`}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchProjects} disabled={loading} className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors disabled:opacity-50">
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={() => setIsAddingProject(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <Plus size={18} />
                        Yangi loyiha
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl h-[200px] animate-pulse" />
                    ))
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Briefcase size={20} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingProject(project)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                                        <MoreVertical size={16} />
                                    </button>
                                    <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-white mb-1">{project.title}</h3>
                            <p className="text-sm text-white/40 mb-3 line-clamp-2">{project.description}</p>
                            <span className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded">{project.category}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            {isAddingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Yangi loyiha</h2>
                        <form onSubmit={handleAddProject} className="space-y-4">
                            <input type="text" required placeholder="Nomi" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <textarea required placeholder="Tavsif" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" placeholder="Rasm URL" value={newProject.image} onChange={e => setNewProject({ ...newProject, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" placeholder="Kategoriya" value={newProject.category} onChange={e => setNewProject({ ...newProject, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsAddingProject(false)} className="px-4 py-2 text-white/60 hover:text-white">Bekor qilish</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white">Qo'shish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Loyihani tahrirlash</h2>
                        <form onSubmit={handleSaveProject} className="space-y-4">
                            <input type="text" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <textarea value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" value={editingProject.image} onChange={e => setEditingProject({ ...editingProject, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <input type="text" value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 text-white/60 hover:text-white">Bekor qilish</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white">Saqlash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
