import { Shield, AlertTriangle, ShieldCheck, Clock, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SafetyScoreRing } from "@/components/SafetyScoreRing";
import { AlertCard } from "@/components/AlertCard";
import { ChildCard } from "@/components/ChildCard";
import { alerts, weeklyActivity, threatCategories } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { getChildren, Child } from "@/lib/childApi";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await getChildren();
        // The API returns { success: true, children: [...] }, so we need to extract the array
        // @ts-ignore - The API return type needs to be updated, but for now we handle it here
        setChildren(response.children || []);
      } catch (error) {
        console.error("Failed to fetch children for dashboard", error);
        // Don't show toast here to avoid spamming if dashboard reloads often, 
        // or keep it if strictly needed. utilizing console for now.
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // Mock alerts are fine for now, we don't have a real alerts API yet
  const unreadAlerts = alerts.filter((a) => !a.isRead);

  // Calculate dynamic scores based on real children
  // (We need to replicate the random logic or just use a placeholder if we didn't save stats to DB yet.
  // The ChildCard generates stats deterministically on the fly. 
  // For the dashboard summary, we can do a similar deterministic calc or just average a placeholder for now to avoid complexity creeping in.)

  // Let's use a simple average of "85" if no children, to look good.
  // Or better, let's replicate the deterministic logic for accuracy? 
  // For now, let's stick to a safe default if empty, or calculate if present.

  const calculateScore = (id: number) => 60 + ((id * 12345) % 39);

  const overallScore = children.length > 0
    ? Math.round(children.reduce((s, c) => s + calculateScore(c.id), 0) / children.length)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Real-time safety monitoring overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Overall Safety"
          value={`${overallScore}%`}
          subtitle="Across all children"
          icon={Shield}
          variant="primary"
        />
        <StatCard
          title="Active Alerts"
          value={unreadAlerts.length}
          subtitle="Require attention"
          icon={AlertTriangle}
          variant="danger"
          trend={{ value: "2 fewer than yesterday", positive: true }}
        />
        <StatCard
          title="Threats Blocked"
          value={46}
          subtitle="This week"
          icon={ShieldCheck}
          variant="success"
          trend={{ value: "12% increase", positive: false }}
        />
        <StatCard
          title="Avg Screen Time"
          value="3h 6m"
          subtitle="Per child today"
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Charts + Recent Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="col-span-2 rounded-xl border bg-card p-6 shadow-card">
          <h2 className="font-display font-semibold text-foreground">Weekly Activity</h2>
          <p className="text-sm text-muted-foreground">Threats detected vs blocked</p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="threats" name="Detected" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="blocked" name="Blocked" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Categories */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="font-display font-semibold text-foreground">Threat Types</h2>
          <p className="text-sm text-muted-foreground">Distribution this week</p>
          <div className="mt-4 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {threatCategories.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {threatCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium text-foreground">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Recent Alerts</h2>
          <a href="/alerts" className="text-sm font-medium text-secondary hover:underline">View all →</a>
        </div>
        <div className="mt-4 space-y-3">
          {alerts.slice(0, 4).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Children Overview */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Children</h2>
          <a href="/children" className="text-sm font-medium text-secondary hover:underline">Manage →</a>
        </div>

        {isLoading ? (
          <div className="mt-8 text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-muted-foreground">Loading family data...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            <p>No children profiles added yet.</p>
            <a href="/children" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">Add your first profile</a>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
