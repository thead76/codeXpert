// Dashboard.jsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import ChatBot from "../components/ChatBot";
import {
  Bell,
  Plus,
  Search,
  Users,
  Handshake,
  ClipboardList,
  BarChart3,
  FolderKanban,
  Boxes,
  ChevronRight,
  MessageSquareText,
  CalendarClock,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Small helpers
const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, delay: 0.04 * i },
});

const SectionTitle = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
    {action}
  </div>
);

const StatCard = ({ icon: Icon, title, value, delta, hint, i = 0 }) => (
  <motion.div
    {...fadeUp(i)}
    className="relative rounded-2xl bg-gradient-to-br from-[#1a103d] to-[#2a1f52] border border-white/10 p-5 shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1 transition"
  >
    <div className="flex items-center gap-3">
      <div className="rounded-xl p-2 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 border border-white/10">
        <Icon className="text-pink-400" size={20} />
      </div>
      <div className="text-sm text-gray-300">{title}</div>
    </div>
    <div className="mt-3 flex items-end justify-between">
      <div className="text-2xl font-bold">{value}</div>
      {delta && (
        <span
          className={`text-xs px-2 py-1 rounded-full border ${
            delta?.positive
              ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
              : "text-rose-300 border-rose-500/40 bg-rose-500/10"
          }`}
        >
          {delta.value}
        </span>
      )}
    </div>
    {hint && <div className="mt-2 text-xs text-gray-400">{hint}</div>}
  </motion.div>
);

const FeatureCard = ({ emoji, title, desc, cta = "Open", i = 0 }) => (
  <motion.div
    {...fadeUp(i)}
    className="group rounded-2xl bg-[#1a103d] border border-white/10 p-5 shadow-lg hover:-translate-y-1 hover:shadow-pink-500/10 transition"
  >
    <div className="text-2xl">{emoji}</div>
    <h4 className="text-lg font-semibold mt-2">{title}</h4>
    <p className="text-gray-300 text-sm mt-1">{desc}</p>
    <button className="mt-4 inline-flex items-center gap-2 text-pink-400 hover:text-pink-300">
      {cta} <ChevronRight size={16} />
    </button>
    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-pink-500/40 transition" />
  </motion.div>
);

const ProgressPill = ({ label, value }) => (
  <div>
    <div className="flex items-center justify-between text-xs mb-1">
      <span className="text-gray-300">{label}</span>
      <span className="font-semibold">{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-indigo-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const TeamItem = ({ name, members, progress }) => (
  <div className="rounded-xl border border-white/10 bg-[#20144a] p-4 hover:bg-[#241a54] transition">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-gray-400">{members} members</div>
      </div>
      <button className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition">
        View
      </button>
    </div>
    <div className="mt-3">
      <ProgressPill label="Sprint progress" value={progress} />
    </div>
  </div>
);

const KanbanColumn = ({ title, items = [] }) => (
  <div className="rounded-2xl bg-[#1a103d] border border-white/10 p-4 min-h-[260px]">
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <span className="text-xs text-gray-400">{items.length}</span>
    </div>
    <div className="space-y-3">
      {items.map((t, idx) => (
        <div
          key={idx}
          className="rounded-xl bg-[#2a1f52] p-3 border border-white/10 hover:shadow-md hover:-translate-y-0.5 transition"
        >
          <div className="text-sm font-medium">{t.title}</div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <MessageSquareText size={14} /> {t.comments}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock size={14} /> {t.due}
            </span>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-xs text-gray-400 italic">No items</div>
      )}
    </div>
  </div>
);

const SprintDonut = ({ value = 72 }) => {
  const data = useMemo(
    () => [{ name: "progress", value }, { name: "rest", value: 100 - value }],
    [value]
  );
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="65%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar dataKey="value" clockWise background />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="relative -mt-28 text-center">
        <div className="text-2xl font-bold">{value}%</div>
        <div className="text-xs text-gray-400">Sprint Complete</div>
      </div>
    </div>
  );
};

const VelocityArea = ({ points }) => (
  <div className="h-40">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points}>
        <defs>
          <linearGradient id="vgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="sprint" hide />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: "#1a103d",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "white",
          }}
        />
        <Area
          type="monotone"
          dataKey="points"
          stroke="#ec4899"
          fill="url(#vgrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function Dashboard() {
  // Mock data (replace with backend later)
  const teams = [
    { name: "Core Platform", members: 8, progress: 78 },
    { name: "Mobile Squad", members: 5, progress: 64 },
    { name: "DevOps Crew", members: 4, progress: 54 },
  ];

  const kanban = {
    todo: [
      { title: "Auth: Google OAuth UI", comments: 6, due: "Sep 06" },
      { title: "Add code review badges", comments: 2, due: "Sep 07" },
    ],
    doing: [
      { title: "Bug finder suggestions engine (UI)", comments: 4, due: "Sep 05" },
      { title: "Team invites flow", comments: 1, due: "Sep 04" },
    ],
    review: [{ title: "Dashboard responsive QA", comments: 3, due: "Sep 03" }],
    done: [{ title: "OTP modal animation", comments: 5, due: "Sep 02" }],
  };

  const velocity = [
    { sprint: "S-18", points: 42 },
    { sprint: "S-19", points: 48 },
    { sprint: "S-20", points: 50 },
    { sprint: "S-21", points: 57 },
    { sprint: "S-22", points: 61 },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0f0425] text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#0f0425]/80 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3">
          <div className="text-xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
            codeXpert Dashboard
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2 bg-[#1a103d] border border-white/10 rounded-full px-3 py-2 w-[320px]">
            <Search size={16} className="text-pink-400" />
            <input
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
              placeholder="Search tasks, teams, projects…"
            />
          </div>
          <button className="relative rounded-xl p-2 bg-[#1a103d] border border-white/10 hover:scale-105 transition">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
          </button>
          <div className="ml-1 rounded-xl px-3 py-2 bg-gradient-to-br from-pink-500/10 to-indigo-500/10 border border-white/10">
            <div className="text-xs text-gray-300">Signed in as</div>
            <div className="text-sm font-semibold">admin@codexpert.com</div>
          </div>
        </div>
      </div>

      {/* Hero / quick actions */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <motion.div
          {...fadeUp(0)}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a103d] to-[#2a1f52] p-5 md:p-6 shadow-xl"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <div className="text-sm text-gray-300">Good to see you, Admin 👋</div>
              <h2 className="text-2xl md:text-3xl font-extrabold">
                Ship faster with agentic AI & great teamwork
              </h2>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 px-4 py-2 font-semibold hover:scale-105 transition">
                <Plus size={16} /> Create Team
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15 transition border border-white/10">
                <ClipboardList size={16} /> New Task
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15 transition border border-white/10">
                <Handshake size={16} /> Invite Member
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Metrics row */}
      <div className="mx-auto max-w-7xl px-4 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          i={0}
          icon={Users}
          title="Active Teams"
          value="06"
          delta={{ value: "+1", positive: true }}
          hint="Across 3 projects"
        />
        <StatCard
          i={1}
          icon={FolderKanban}
          title="Open Tasks"
          value="28"
          delta={{ value: "-4", positive: true }}
          hint="7 due this week"
        />
        <StatCard
          i={2}
          icon={ClipboardList}
          title="In Review"
          value="09"
          hint="PRs waiting for approval"
        />
        <StatCard
          i={3}
          icon={BarChart3}
          title="On-time Delivery"
          value="92%"
          delta={{ value: "+3%", positive: true }}
        />
        <StatCard
          i={4}
          icon={Boxes}
          title="Active Sprints"
          value="03"
          hint="Ends in 4 days"
        />
        <StatCard
          i={5}
          icon={Handshake}
          title="New Invites"
          value="4"
          hint="Pending approvals"
        />
      </div>

      {/* Features row (maps to your list) */}
      <div className="mx-auto max-w-7xl px-4 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          i={0}
          emoji="👥"
          title="Create Teams"
          desc="Form and organize project-specific teams with ease."
        />
        <FeatureCard
          i={1}
          emoji="🤝"
          title="Work Together"
          desc="Collaborate with team members in real-time across tasks."
        />
        <FeatureCard
          i={2}
          emoji="🧑‍💼"
          title="Task Assignment"
          desc="Leaders assign tasks and monitor progress instantly."
        />
        <FeatureCard
          i={3}
          emoji="📋"
          title="Track Progress"
          desc="View pending and completed tasks in one place."
        />
        <FeatureCard
          i={4}
          emoji="📁"
          title="Project Insights"
          desc="See who assigned what and accept or decline with context."
        />
        <FeatureCard
          i={5}
          emoji="🧩"
          title="Multi-Project"
          desc="Handle multiple teams and projects efficiently."
        />
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Teams & Activity */}
        <motion.div {...fadeUp(0)} className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#1a103d] border border-white/10 p-5">
            <SectionTitle
              title="My Teams"
              action={
                <button className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition">
                  Manage
                </button>
              }
            />
            <div className="space-y-3">
              {teams.map((t) => (
                <TeamItem key={t.name} {...t} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1a103d] border border-white/10 p-5">
            <SectionTitle title="Recent Activity" />
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-emerald-400" />
                <div>
                  <div className="font-medium">Sprint 22 started</div>
                  <div className="text-gray-400 text-xs">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-pink-400" />
                <div>
                  <div className="font-medium">PR #431 moved to Review</div>
                  <div className="text-gray-400 text-xs">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                <div>
                  <div className="font-medium">New team invite sent to Sam</div>
                  <div className="text-gray-400 text-xs">Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Middle: Kanban snapshot */}
        <motion.div {...fadeUp(1)} className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-[#1a103d] border border-white/10 p-5">
            <SectionTitle
              title="Task Board — Snapshot"
              action={
                <button className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition">
                  Open Board
                </button>
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KanbanColumn title="To Do" items={kanban.todo} />
              <KanbanColumn title="In Progress" items={kanban.doing} />
              <KanbanColumn title="Review" items={kanban.review} />
              <KanbanColumn title="Done" items={kanban.done} />
            </div>
          </div>

          <div className="rounded-2xl bg-[#1a103d] border border-white/10 p-5">
            <SectionTitle title="Velocity Trend" />
            <VelocityArea points={velocity} />
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <ProgressPill label="Code Quality" value={91} />
              <ProgressPill label="Test Coverage" value={78} />
              <ProgressPill label="Cycle Time" value={68} />
            </div>
          </div>
        </motion.div>

        {/* Right: Sprint & Insights */}
        <motion.div {...fadeUp(2)} className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl bg-[#1a103d] border border-white/10 p-5">
            <SectionTitle title="Sprint Overview" />
            <SprintDonut value={72} />
            <div className="mt-3 grid grid-cols-3 text-center text-xs">
              <div>
                <div className="font-semibold">32</div>
                <div className="text-gray-400">Committed</div>
              </div>
              <div>
                <div className="font-semibold">23</div>
                <div className="text-gray-400">Completed</div>
              </div>
              <div>
                <div className="font-semibold">4d</div>
                <div className="text-gray-400">Remaining</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <ProgressPill label="On-time delivery" value={92} />
              <ProgressPill label="Bug fix rate" value={86} />
            </div>
          </div>

          <div className="rounded-2xl bg-[#1a103d] border border-white/10 p-5">
            <SectionTitle title="Project Insights" />
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-white/10 p-3 bg-[#2a1f52]">
                🔍 Review depth up by <b>12%</b> — fewer regressions this sprint.
              </div>
              <div className="rounded-xl border border-white/10 p-3 bg-[#2a1f52]">
                ⚡ High-impact tasks cluster on <b>auth & dashboards</b>.
              </div>
              <div className="rounded-xl border border-white/10 p-3 bg-[#2a1f52]">
                🧩 Two projects share dependencies — consider a <b>shared module</b>.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Place your global Chatbot floating button here (already added app-wide) */}
      <ChatBot /> 
    </div>
  );
}
