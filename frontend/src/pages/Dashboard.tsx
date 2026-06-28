import { useEffect, useState } from 'react'
import { api } from '../api/axios';
import NavBar from '../components/NavBar';
import CreateModal from '../components/CreateModal';
import EditFormModal from '../components/EditFormModal';
import toast from 'react-hot-toast';

export type Note = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  link: string | null;
}
const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    link: ""
  })
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    tags: "",
    link: ""
  })

  function startEdit(note: Note) {
    setEditingId(note.id);

    setEditForm({
      title: note.title,
      content: note.content,
      tags: note.tags ? note.tags.join(", ") : "",
      link: note.link || "",
    });
  };

  async function updateNote() {
    if (!editingId) return;

    try {
      setUpdating(true);
      await api.put(`/notes/${editingId}`, {
        title: editForm.title,
        content: editForm.content,
        tags: editForm.tags
          ? editForm.tags.split(",").map((tag) => tag.trim())
          : [],
        link: editForm.link || null,
      });
      toast.success("Note updated!");
      setEditingId(null);
      setEditForm({
        title: "",
        content: "",
        tags: "",
        link: "",
      });

      fetchNotes();
    }catch(err){
      toast.error("Couldn't update note.");
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      content: "",
      tags: "",
      link: "",
    });
  };

  async function createNote() {
    try {
      setCreating(true);
      await api.post("/notes", {
        title: form.title,
        content: form.content,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        link: form.link || null
      })
      setForm({
        title: "",
        content: "",
        tags: "",
        link: ""
      })
      toast.success("Note created Successfully");
      setShowCreateModal(false);
      fetchNotes()
    } catch (err) {
      toast.error("Failed to create note.");
    } finally {
      setCreating(false);
    }
  }

  async function deleteNote(id: number) {
    try {
      setDeletingId(id);

      await api.delete(`/notes/${id}`);
      toast.success("Note deleted.");
      fetchNotes();
    }catch(err){
      toast.error("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  async function fetchNotes() {
    const res = await api.get("/notes");
    setNotes(res.data.notes);
  }
  useEffect(() => {
    fetchNotes();
  }, [])
  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>Your Notes</h1>
            <p className='text-slate-500'>Store and Search Your Brain</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className=' bg-black text-white px-5 py-3 rounded-xl hover:opacity-90'>Create Note</button>
        </div>
        {showCreateModal && (
          <CreateModal
            form={form}
            setForm={setForm}
            onClose={() => setShowCreateModal(false)}
            OnClick={createNote}
            creating={creating}
          />
        )}
        {editingId && (
          <EditFormModal
            editForm={editForm}
            setEditForm={setEditForm}
            onClick={updateNote}
            onClose={() => {
              setEditingId(null);
              cancelEdit();
            }}

            updating={updating}
          />
        )}
        {notes &&notes.length === 0 ? (
          <div className="bg-white border rounded-3xl p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">📝</div>

            <h2 className="text-2xl font-bold mb-2">
              No notes yet
            </h2>

            <p className="text-slate-500 mb-6">
              Start building your second brain by creating your first note.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {notes && notes.map((note) =>
            <div key={note.id} className='bg-white border rounder-2xl p-5 shadow-sm'>
              <h3 className='text-xl font-semibold mb-2'>{note.title}</h3>
              <p className='text-slate-600 mb-4'>{note.content}</p>
              {note.tags.length > 0 && <div className='flex flex-wrapgap-2 mb-4'>Tags: {note.tags.map((tag) => <span key={tag} className='bg-slate-100 px-3 py-1 rounded-full text-sm' >{tag}</span>)}</div>}
              {note.link && <a href={note.link} target='_blank' className="text-blue-600 hover:underline">OpenLink</a>}
              <br />
              <div className='flex gap-2 mt-4'>
                <button onClick={() => startEdit(note)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
                <button disabled={deletingId == note.id} onClick={() => deleteNote(note.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg">{deletingId === note.id ? "Deleting..." : "Delete"}</button>
              </div>
            </div>
          )}
        </div>
        )}
        
      </div>
    </>
  )
}

export default Dashboard