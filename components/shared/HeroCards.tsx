import { siJavascript, siLaravel, siNextdotjs, siNodedotjs, siReact, siWordpress } from "simple-icons"
import { SquareTerminal } from "lucide-react"
import MacWindow from "@/components/shared/MacWindow"
import StatusCard from "@/components/shared/StatusCard"

// Local constants - decorative cards floating around the hero photo
// Tooltips on a minimised window's icon (click it to restore the window)
const MINIMIZED_LABELS = {
  stack: "Tech stack",
  terminal: "Terminal",
}

const STACK_ICONS = [
  { icon: siReact, color: "#61DAFB" },
  { icon: siJavascript, color: "#F7DF1E" },
  { icon: siNextdotjs, color: "#ccd6f6" },
  { icon: siNodedotjs, color: "#5FA04E" },
  { icon: siLaravel, color: "#FF2D20" },
  { icon: siWordpress, color: "#7aa7d6" },
]

const TERMINAL = {
  title: "ridwan — zsh",
  prompt: "ridwan@portfolio:~$",
  command: "yarn dev",
  output: ["$ next dev", "", "▲ Next.js 16"],
  urls: [
    { label: "- Local:", value: "http://localhost:3000" },
    { label: "- Network:", value: "http://192.168.0.10:3000" },
  ],
  ready: "✓ Ready in 1.2s",
}

const HeroCards = () => (
  <div aria-hidden="true" className="select-none">
    {/* Neck height, tucked against the left of the photo */}
    <StatusCard className="absolute top-[27%] right-[70%] hidden xl:block" floatDelay="-1s" />

    {/* Head height, just right of the photo */}
    <MacWindow
      className="absolute top-[19%] -right-24 hidden xl:block w-60"
      minimizedLabel={MINIMIZED_LABELS.stack}
      minimizeTo="left"
      minimizedShift={24}
      minimizedIcon={
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#61DAFB" aria-hidden>
          <path d={siReact.path} />
        </svg>
      }
      floatDelay="-2s">
      <div className="grid grid-cols-3 gap-5 px-6 py-5">
        {STACK_ICONS.map(({ icon, color }) => (
          <svg
            key={icon.slug}
            viewBox="0 0 24 24"
            className="w-9 h-9 mx-auto"
            fill={color}
            role="img"
            aria-label={icon.title}>
            <path d={icon.path} />
          </svg>
        ))}
      </div>
    </MacWindow>

    <MacWindow
      className="absolute bottom-[4%] right-[65%] hidden xl:block xl:w-80 2xl:w-96"
      title={TERMINAL.title}
      minimizedLabel={MINIMIZED_LABELS.terminal}
      minimizeTo="right"
      minimizedShift={-64}
      minimizedIcon={<SquareTerminal className="w-7 h-7 text-custom-accent" strokeWidth={1.5} />}
      floatDelay="-4s">
      <div className="p-5 whitespace-nowrap overflow-hidden font-mono text-xs leading-6">
        <p>
          <span className="text-custom-accent">{TERMINAL.prompt}</span>{" "}
          <span className="text-custom-foreground">{TERMINAL.command}</span>
        </p>
        {TERMINAL.output.map((line, i) => (
          <p key={i} className="text-custom-secondary">
            {line || " "}
          </p>
        ))}
        {TERMINAL.urls.map(({ label, value }) => (
          <p key={label} className="pl-2 text-custom-secondary">
            <span className="text-custom-foreground/80">{label}</span> {value}
          </p>
        ))}
        <p className="text-custom-accent">
          {TERMINAL.ready}
          <span className="inline-block w-2 h-3.5 ml-1 align-middle bg-custom-accent motion-safe:animate-blink" />
        </p>
      </div>
    </MacWindow>
  </div>
)

export default HeroCards
