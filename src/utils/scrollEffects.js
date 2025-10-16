// scrollEffects.js
export function useGalaxyScrollEffect(ref, setUniforms) {
  // ref = Galaxy container or parent
  // setUniforms = function to update uniforms in Galaxy

  function handleScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Section thresholds
    const trendingStart = windowHeight * 1; // Trending section top
    const allToolsStart = windowHeight * 2; // All Tools section top

    let zoom = 1;
    let driftX = 0;

    // Scroll into Trending → zoom in
    if (scrollY >= trendingStart && scrollY < allToolsStart) {
      const progress = (scrollY - trendingStart) / windowHeight; // 0 → 1
      zoom = 1 + 0.5 * progress; // zoom from 1 → 1.5
      driftX = 0; // optional small drift
    }

    // Scroll into All Tools → zoom out & drift left
    if (scrollY >= allToolsStart) {
      const progress = (scrollY - allToolsStart) / windowHeight; // 0 → 1
      zoom = 1.5 - 0.5 * progress; // zoom back 1.5 → 1
      driftX = -0.5 * progress; // drift left
    }

    // Update uniforms
    if (setUniforms) setUniforms({ scrollZoom: zoom, scrollDriftX: driftX });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  return () => window.removeEventListener('scroll', handleScroll);
}
