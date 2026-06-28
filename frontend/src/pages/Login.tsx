import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../api/axios"
import toast from "react-hot-toast"

const Login = () => {
  const navigate = useNavigate()
  const [loading,setLoading]=useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  async function handleLogin() {
    try{
      setLoading(true);
    const res = await api.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    navigate("/dashboard")
    toast.success("Welcome back!");
    
    }catch(err){
      toast.error("Invalid credentials.");
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Welcome back</h1>
        <p className="text-slate-500 mb-6">Login to your second brain.</p>
        <div className="space-y-4">
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
          <button disabled={loading} onClick={handleLogin} className="w-full bg-black text-white py-3 rounded-xl">{loading ? "Logging in..." : "Login"}</button> <br />
          <p className="text-sm text-slate-500 mt-6">
          Don't have an Account ? <Link to="/" className="text-black font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login