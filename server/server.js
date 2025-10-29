import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile("./db.json");
const db = new Low(adapter, { users: [], listings: [] });
await db.read();
db.data = db.data || { users: [], listings: [] };
await db.write();

const JWT_SECRET = "demo-secret-please-change";

// Health
app.get("/api/health", (_, res) => res.json({ ok: true, service: "api", ts: Date.now() }));

// helpers
function auth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
// simple server-side image validation for demo
function validateImageMeta(imageMeta) {
  if (!imageMeta) return { ok: true }; // optional
  const { filename = "", sizeMB = 0, mime = "" } = imageMeta;
  const allowed = ["image/jpeg","image/png","image/webp"];
  if (!allowed.includes(mime)) return { ok: false, msg: "Unsupported file type" };
  if (sizeMB > 5) return { ok: false, msg: "File too large (>5MB)" };
  if (filename.endsWith(".exe")) return { ok: false, msg: "Executable files not allowed" };
  return { ok: true };
}

// create listing (auth)
app.post("/api/listings", auth, async (req, res) => {
  const { title, price, category, description, imageUrl, imageMeta } = req.body || {};
  if (!title || price === undefined) return res.status(400).json({ error: "title & price required" });
  const imgCheck = validateImageMeta(imageMeta);
  if (!imgCheck.ok) return res.status(400).json({ error: imgCheck.msg });
  const item = {
    id: nanoid(),
    title,
    price: Number(price),
    category: category || "General",
    description: description || "",
    imageUrl: imageUrl || "https://placehold.co/400x300?text=Listing",
    status: "active",
    ownerId: req.user.sub,
    createdAt: Date.now()
  };
  db.data.listings.push(item);
  await db.write();
  res.json(item);
});

// search + filter + pagination
app.get("/api/listings", async (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase();
  const priceMax = Number(req.query.priceMax || Infinity);
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = 6;
  let items = db.data.listings.filter(l =>
    (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) &&
    l.price <= priceMax &&
    l.status !== "hidden"
  ).sort((a,b) => b.createdAt - a.createdAt);
  const start = (page - 1) * pageSize;
  res.json({ results: items.slice(start, start + pageSize), total: items.length, page, pageSize });
});

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}
app.patch("/api/admin/listings/:id/toggle", auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  const listing = db.data.listings.find(l => l.id === id);
  if (!listing) return res.status(404).json({ error: "Not found" });
  listing.status = (listing.status === "active") ? "hidden" : "active";
  await db.write();
  res.json({ id: listing.id, status: listing.status });
});

// --- Auth ---
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email?.endsWith("@ufl.edu")) return res.status(400).json({ error: "UF email required" });
  if (!password) return res.status(400).json({ error: "Password required" });
  const exists = db.data.users.find(u => u.email === email);
  if (exists) return res.status(409).json({ error: "User exists" });

  const user = { id: nanoid(), email, name: name || "Student", role: email === "admin@ufl.edu" ? "admin" : "student", verified: true };
  db.data.users.push(user);
  await db.write();
  res.json({ message: "Registered (mock-verified). Now login." });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = db.data.users.find(u => u.email === email);
  if (!user || !password) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, role: user.role });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


