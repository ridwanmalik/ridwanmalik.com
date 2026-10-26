import DelayedFadeIn from "@/components/shared/DelayedFadeIn"
import HeroGlobe from "@/components/shared/HeroGlobe"

// The hero photo's Reveal starts at 0.15s and runs 0.6s; the globe waits until it has landed
const GLOBE_DELAY = 0.15 + 0.6 + 0.1

const HeroBackdrop = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
    {/* World globe, bottom right; dots light up around the cursor */}
    <DelayedFadeIn delay={GLOBE_DELAY} className="absolute -right-16 -bottom-40 hidden md:block w-[560px]">
      <HeroGlobe className="w-full text-custom-accent" />
    </DelayedFadeIn>
  </div>
)

export default HeroBackdrop
