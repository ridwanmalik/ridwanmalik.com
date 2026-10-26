import HeroGlobe from "@/components/shared/HeroGlobe"

const HeroBackdrop = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
    {/* World globe, bottom right; dots light up around the cursor */}
    <HeroGlobe className="absolute -right-16 -bottom-40 hidden md:block w-[560px] text-custom-accent" />
  </div>
)

export default HeroBackdrop
