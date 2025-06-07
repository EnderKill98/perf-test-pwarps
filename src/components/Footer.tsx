import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 py-12 border-t border-white/10 backdrop-blur-xl bg-white/5">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          <span>Perf-Test Warps</span>
        </div>
        <p className="text-purple-200">Made by <Link to={"https://enderkill98.com"} className="text-cyan-300">EnderKill98</Link>, <Link to={"https://khaodoes.dev"} className="text-cyan-300">KhaoDoesDev</Link>.</p>
        <p className="text-purple-300/60">
          Explore people's player warps in Tubbo's Performance Testing Minecraft Server.
        </p>
				<code className="text-sm">perf-test.play.hosting</code>
      </div>
    </footer>
  )
}
