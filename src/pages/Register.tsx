import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/api";
import { Shield, Eye, EyeOff, Loader2, Check, X } from "lucide-react";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-5
}

const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-warning",
  "bg-success",
  "bg-success",
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const validations = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validations.email) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validations.minLength) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!validations.hasUppercase) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!validations.hasLowercase) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }
    if (!validations.hasNumber) {
      setError("Password must contain at least one number.");
      return;
    }
    if (!validations.hasSpecial) {
      setError("Password must contain at least one special character (!@#$%^&*).");
      return;
    }
    if (!validations.match) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({ name: name.trim(), email: email.trim(), password });
      if (res.success) {
        navigate("/login", { state: { registered: true } });
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to connect to server.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ valid, label }: { valid: boolean; label: string }) => (
    <div className="flex items-center gap-1.5 text-xs">
      {valid ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={valid ? "text-success" : "text-muted-foreground"}>{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Cyber Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px]"></div>
      </div>

      <Card className="w-full max-w-sm animate-fade-up border-blue-500/20 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">Create Account</CardTitle>
          <CardDescription>Join CyberShield to protect your family online</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength] : "bg-muted"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <ValidationItem valid={validations.email} label="Valid email address" />
              <ValidationItem valid={validations.minLength} label="At least 8 characters" />
              <ValidationItem valid={validations.hasUppercase} label="One uppercase letter" />
              <ValidationItem valid={validations.hasLowercase} label="One lowercase letter" />
              <ValidationItem valid={validations.hasNumber} label="One number" />
              <ValidationItem valid={validations.hasSpecial} label="One special character (!@#$%^&*)" />
              <ValidationItem valid={validations.match} label="Passwords match" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
