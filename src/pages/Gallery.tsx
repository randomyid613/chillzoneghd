import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LogIn, LogOut, Upload, Trash2, Construction, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, logout, isLoggedIn, getAdminToken } from "@/lib/auth";
import { fetchImages, uploadImage, deleteImage, GalleryImage } from "@/lib/gallery-store";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/chillzone-logo.webp";
import SEO from "@/components/SEO";


const Gallery = () => {
  const [searchParams] = useSearchParams();
  const showLogin = searchParams.get("admin") === "true";
  const [authed, setAuthed] = useState(isLoggedIn());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadImages = useCallback(async () => {
    setLoading(true);
    const imgs = await fetchImages();
    setImages(imgs);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      setAuthed(true);
      setPassword("");
      toast({ title: "Logged in", description: "Welcome back!" });
    } else {
      toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  const handleUpload = useCallback(async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be under 10 MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    const result = await uploadImage(file, caption, getAdminToken());
    setUploading(false);

    if (result) {
      setImages((prev) => [result, ...prev]);
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      toast({ title: "Photo added!" });
    } else {
      toast({ title: "Upload failed", description: "Check your Worker is deployed and VITE_GALLERY_API_URL is set.", variant: "destructive" });
    }
  }, [caption, toast]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await deleteImage(id, getAdminToken());
    if (ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast({ title: "Photo removed" });
    } else {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  }, [toast]);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <SEO
        title="Gallery — ChillZone moments"
        description="Photos from ChillZone events, workshops and activities for young people in the Jewish community."
        path="/gallery"
      />
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-heading text-4xl font-bold text-gradient-teal">Gallery</h1>
            <p className="mt-2 text-muted-foreground">Moments from ChillZone events & activities</p>
          </div>
          {authed ? (
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut size={16} /> Log out
            </Button>
          ) : null}
        </div>

        {/* Admin Upload Panel */}
        {authed && (
          <div className="mb-12 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload size={18} className="text-primary" /> Upload Photo
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                aria-label="Choose photo to upload"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              <Input
                placeholder="Caption (optional)"
                aria-label="Photo caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="sm:max-w-xs"
              />
              <Button onClick={handleUpload} disabled={uploading} className="gap-2 shrink-0">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Uploading…" : "Add"}
              </Button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : images.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-transform hover:scale-[1.02]"
              >
                <img
                  src={img.src}
                  alt={img.caption || "ChillZone event moment"}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                    <p className="text-sm font-medium text-foreground">{img.caption}</p>
                  </div>
                )}
                {authed && (
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="absolute top-3 right-3 rounded-full bg-destructive p-2 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Delete photo"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card/60 p-10 text-center backdrop-blur">
            <img src={logo} alt="ChillZone — A safe space for Jewish young people" className="mx-auto h-24 w-auto opacity-40 mb-6" />
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Construction size={28} className="text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gradient-teal">Gallery under construction</h2>
            <p className="mt-3 text-muted-foreground">
              We're busy putting together photos from our sessions, workshops and trips. Check back soon to see ChillZone in action.
            </p>
            {!authed && showLogin && (
              <p className="mt-4 text-xs text-muted-foreground/60">Admin? Log in below to start uploading.</p>
            )}
          </div>
        )}

        {/* Login Form (shown only when ?admin=true) */}
        {!authed && showLogin && (
          <div className="mt-16 mx-auto max-w-sm">
            <form onSubmit={handleLogin} className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
              <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <LogIn size={18} className="text-primary" /> Admin Login
              </h2>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  aria-label="Admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  aria-label="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">Log In</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
};

export default Gallery;
