import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { api, setToken } from "./api";
function Login() {
  const [email, setEmail] = useState("student@ufl.edu");
  const [password, setPassword] = useState("Gator1234");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  async function register() {
    try {
      await api.post("/auth/register", { email, password, name: "Student" });
      setMsg("Registered (mock-verified). Now login.");
    } catch (e) { setMsg(e.response?.data?.error || "Register error"); }
  }
  async function login() {
    try {
      const r = await api.post("/auth/login", { email, password });
      setToken(r.data.token);
      localStorage.setItem("token", r.data.token);
      localStorage.setItem("role", r.data.role);
      nav("/listings");
    } catch (e) { setMsg(e.response?.data?.error || "Login error"); }
  }
  return (
    <div style={{ maxWidth: 420, margin: "40px auto", display:"grid", gap:8 }}>
      <h2>Login / Register</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="UF email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <p>{msg}</p>
      <p>Tip: use <b>admin@ufl.edu</b> to demo admin access.</p>
    </div>
  );
}
function NewListing() {
  const [title,setTitle]=useState("COP3530 Textbook");
  const [price,setPrice]=useState(45);
  const [category,setCategory]=useState("Textbooks");
  const [description,setDescription]=useState("Lightly used.");
  const [msg,setMsg]=useState("");
  async function create() {
    try{
      const r = await api.post("/listings",{
        title, price, category, description,
        imageUrl:"https://placehold.co/400x300?text=Listing",
        imageMeta:{ filename:"book.jpg", sizeMB:2, mime:"image/jpeg" } // valid demo
      });
      setMsg(`Created listing #${r.data.id}`);
    }catch(e){ setMsg(e.response?.data?.error || "Create error"); }
  }
  return (
    <div style={{ maxWidth: 520, margin: "20px auto", display:"grid", gap:8 }}>
      <h3>New Listing</h3>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" />
      <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
      <button onClick={create}>Publish</button>
      <p>{msg}</p>
    </div>
  );
}
function Listings() {
  const [q,setQ]=useState("textbook");
  const [priceMax,setPriceMax]=useState(50);
  const [page,setPage]=useState(1);
  const [data,setData]=useState({ results:[], total:0, page:1, pageSize:6 });
  const role = localStorage.getItem("role") || "student";
  // token restore on refresh
  const saved = localStorage.getItem("token");
  if (saved) setToken(saved);
  async function load(p=page){
    const r = await api.get("/listings",{ params:{ q, priceMax, page:p } });
    setData(r.data); setPage(p);
  }
  async function toggle(id){
    try{
      await api.patch(`/admin/listings/${id}/toggle`);
      load(page);
    }catch(e){
      alert(e.response?.status===403 ? "403 Forbidden (as expected for non-admin)" : "Error");
    }
  }
  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Listings</h2>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." />
        <input value={priceMax} onChange={e=>setPriceMax(e.target.value)} type="number" placeholder="Max Price" />
        <button onClick={()=>load(1)}>Search</button>
        <Link to="/new">+ New Listing</Link>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
        {data.results.map(l=>(
          <div key={l.id} style={{ border:"1px solid #ddd", padding:10, borderRadius:8 }}>
            <img src={l.imageUrl} alt="" style={{ width:"100%", height:140, objectFit:"cover", borderRadius:6 }}/>
            <h4>{l.title}</h4>
            <p>${l.price} · {l.category}</p>
            <p style={{ color:"#666" }}>{l.status}</p>
            <button onClick={()=>toggle(l.id)} disabled={role!=="admin"}>Admin Toggle Status</button>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <button disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={(page*data.pageSize)>=data.total} onClick={()=>load(page+1)}>Next</button>
      </div>
    </div>
  );
}
function Nav() {
  const nav = useNavigate();
  function logout(){
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    nav("/");
  }
  return (
    <div style={{ display:"flex", gap:12, padding:10, borderBottom:"1px solid #eee" }}>
      <Link to="/">Login</Link>
      <Link to="/listings">Listings</Link>
      <Link to="/new">Create</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
export default function App(){
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/listings" element={<Listings/>} />
        <Route path="/new" element={<NewListing/>} />
      </Routes>
    </BrowserRouter>
  );
}
