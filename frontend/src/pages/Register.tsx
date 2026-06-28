import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { api } from "../api/axios";
import toast from "react-hot-toast";


const Register = () => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [form,setForm] = useState({
    name:"",
    email:"",
    password:""
  })
  

  async function handleRegister(){
    setLoading(true);
    await api.post("/auth/register",form);
    navigate("/login")
    toast.success("Account created successfully!");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Create Account</h1>
        <p className="text-slate-500 mb-6">Create your second brain.</p>
        <div className="space-y-4">
          <input placeholder="Name" 
            className="w-full border rounded-xl px-4 py-3"
            type="text" 
            value={form.name} 
            onChange={e=> setForm({...form,name:e.target.value})}
          /> <br />
          <input type="email"
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          /> <br />
          <input type="password"
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          /> <br />
          <button disabled={loading} onClick={handleRegister} className="w-full bg-black text-white py-3 rounded-xl">{loading ? "Creating account..." : "Register"}</button> <br />
          <p className="text-sm text-slate-500 mt-6">
          Already have an Account ? <Link to="/login" className="text-black font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register