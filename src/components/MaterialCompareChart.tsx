import { useEffect, useRef, useState, useMemo } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { Clock, Layers } from 'lucide-react';

interface ChartDataPoint {
  id: 'raw' | 'curated' | 'prestige';
  name: string;
  label: string;
  multiplier: number;
  costLower: number;
  costUpper: number;
  estimatedCost: number;
  hours: number;
}

interface MaterialCompareChartProps {
  spaceType: 'residential' | 'commercial' | 'renovation';
  squareFootage: number;
  activeTier: 'raw' | 'curated' | 'prestige';
  onTierSelect: (tier: 'raw' | 'curated' | 'prestige') => void;
}

export default function MaterialCompareChart({
  spaceType,
  squareFootage,
  activeTier,
  onTierSelect
}: MaterialCompareChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: typeof window !== 'undefined' && window.innerWidth < 480 ? 170 : 220 });
  const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);

  // Monitor container size for responsiveness
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      setDimensions({
        width,
        height: window.innerWidth < 480 ? 170 : 220
      });
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate pricing data for the three material tiers based on standard Indian contracting BOQ
  const chartData = useMemo((): ChartDataPoint[] => {
    // Premium rates in INR per square foot for turnkey design & execution
    let baseRate = 1600; // Curated Residential (premium laminates/veneers, false ceilings, lighting)
    if (spaceType === 'commercial') baseRate = 1900; // Curated Corporate/Retail (acoustic materials, industrial fits)
    if (spaceType === 'renovation') baseRate = 1000; // Curated Home/Office restore and repaint

    const tiers: { id: 'raw' | 'curated' | 'prestige'; name: string; multiplier: number; label: string }[] = [
      { id: 'raw', name: 'Standard Raw Quality', multiplier: 0.65, label: 'Standard' },
      { id: 'curated', name: 'Curated Tenant Style', multiplier: 1.0, label: 'Curated' },
      { id: 'prestige', name: 'Bespoke Luxury Prestige', multiplier: 1.55, label: 'Prestige' }
    ];

    return tiers.map((tier) => {
      const estimatedCost = Math.round(squareFootage * baseRate * tier.multiplier);
      // Realistic coordination & detailed layout blueprinting hours
      const estimatedHours = Math.round((squareFootage * 0.08) * tier.multiplier + 25);
      return {
        id: tier.id,
        name: tier.name,
        label: tier.label,
        multiplier: tier.multiplier,
        costLower: Math.round(estimatedCost * 0.95),
        costUpper: Math.round(estimatedCost * 1.15),
        estimatedCost,
        hours: estimatedHours
      };
    });
  }, [spaceType, squareFootage]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 15, right: 15, bottom: 35, left: 55 };

    const svg = select(svgElement);
    svg.selectAll('*').remove(); // Clean container

    // Add gradients
    const defs = svg.append('defs');
    
    // Gradient for inactive bars
    const gradientInactive = defs.append('linearGradient')
      .attr('id', 'bar-gradient-inactive')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    gradientInactive.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#d2d8c7');
    gradientInactive.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#A8B196');

    // Gradient for active/selected bar
    const gradientActive = defs.append('linearGradient')
      .attr('id', 'bar-gradient-active')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    gradientActive.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#132211');
    gradientActive.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#202918');

    const maxCost = Number(max(chartData, (d: any) => d.costUpper) || 100000);

    // Scales
    const xScale = scaleBand<string>()
      .domain(chartData.map((d: any) => d.id))
      .range([margin.left, width - margin.right])
      .padding(0.35);

    const yScale = scaleLinear()
      .domain([0, maxCost * 1.1])
      .range([height - margin.bottom, margin.top]);

    // Gridlines (Y-axis gridlines for clean visual mapping)
    const yTicks = 4;
    const yTickValues = yScale.ticks(yTicks);
    
    svg.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yTickValues)
      .enter()
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', (d: any) => yScale(d))
      .attr('y2', (d: any) => yScale(d))
      .attr('stroke', '#202918')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,4')
      .attr('opacity', 0.08);

    // Draw bars
    svg.selectAll('.bar')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => xScale(d.id) || 0)
      .attr('y', (d: any) => yScale(d.estimatedCost))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: any) => (height - margin.bottom) - yScale(d.estimatedCost))
      .attr('rx', 6) // Beautiful rounded tops
      .attr('ry', 6)
      .attr('fill', (d: any) => d.id === activeTier ? 'url(#bar-gradient-active)' : 'url(#bar-gradient-inactive)')
      .attr('stroke', (d: any) => d.id === activeTier ? '#202918' : 'none')
      .attr('stroke-width', (d: any) => d.id === activeTier ? 1 : 0)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d: any) {
        setHoveredData(d);
        select(this)
          .transition()
          .duration(150)
          .attr('opacity', 0.88)
          .attr('y', yScale(d.estimatedCost) - 2)
          .attr('height', (height - margin.bottom) - yScale(d.estimatedCost) + 2);
      })
      .on('mouseleave', function () {
        setHoveredData(null);
        select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1.0)
          .attr('y', (d: any) => yScale(d.estimatedCost))
          .attr('height', (d: any) => (height - margin.bottom) - yScale(d.estimatedCost));
      })
      .on('click', (event, d: any) => {
        onTierSelect(d.id);
      });

    // Custom tick/labels layout instead of bulky D3 default axes which look machine-like
    // 1. Bottom X-Axis labels
    svg.append('g')
      .selectAll('.x-label')
      .data(chartData)
      .enter()
      .append('text')
      .attr('class', 'x-label')
      .attr('x', (d: any) => (xScale(d.id) || 0) + xScale.bandwidth() / 2)
      .attr('y', height - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', (d: any) => d.id === activeTier ? '#202918' : 'rgba(32, 41, 24, 0.65)')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-sans)')
      .attr('font-weight', (d: any) => d.id === activeTier ? '800' : '500')
      .style('cursor', 'pointer')
      .text((d: any) => d.label)
      .on('click', (event, d: any) => {
        onTierSelect(d.id);
      });

    // 2. Left Y-Axis labels formatted to Indian Lakhs/Crores
    svg.append('g')
      .selectAll('.y-label')
      .data(yTickValues)
      .enter()
      .append('text')
      .attr('class', 'y-label')
      .attr('x', margin.left - 10)
      .attr('y', (d: any) => yScale(d) + 4)
      .attr('text-anchor', 'end')
      .attr('fill', 'rgba(32, 41, 15, 0.55)')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text((d: any) => {
        if (d >= 10000000) return `₹${(d / 10000000).toFixed(1)} Cr`;
        if (d >= 100000) return `₹${(d / 100000).toFixed(1).replace('.0', '')} L`;
        return `₹${Math.round(d / 1000)}k`;
      });

  }, [dimensions, chartData, activeTier, onTierSelect]);

  const activePoints = chartData.find((d) => d.id === activeTier);

  // Indian financial naming formatting (Lakhs & Crores)
  const formatToIndianLakhs = (amount: number) => {
    if (amount >= 10000000) {
      const crores = amount / 10000000;
      return `₹${crores.toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      const lakhs = amount / 100000;
      return `₹${lakhs.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div id="material-compare-root" className="space-y-4">
      {/* Container holding SVG */}
      <div 
        ref={containerRef} 
        className="w-full bg-cream-soft/30 rounded-xl p-4 border border-sage-muted/10 relative"
      >
        <div className="flex justify-between items-center mb-1 text-[10px] font-label-caps tracking-widest text-sage-muted">
          <span>MATERIAL COMPARISON</span>
          <span className="font-mono text-forest-deep px-1.5 py-0.5 bg-paper-white/80 rounded border border-sage-muted/10">
            Interactive D3 Tool
          </span>
        </div>

        <svg 
          ref={svgRef} 
          width={dimensions.width} 
          height={dimensions.height} 
          style={{ height: `${dimensions.height}px` }}
          className="overflow-visible select-none w-full"
        />

        {/* Legend of Material Tiers */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 pt-2.5 pb-2.5 border-t border-sage-muted/5 mt-1">
          <div className="flex flex-wrap gap-x-3.5 gap-y-1">
            {chartData.map((d) => {
              const isActive = d.id === activeTier;
              return (
                <button
                  key={`legend-${d.id}`}
                  onClick={() => onTierSelect(d.id)}
                  className="flex items-center gap-1.5 cursor-pointer border-none bg-transparent p-0 text-left focus:outline-none transition-transform active:scale-95"
                  title={`Select ${d.name}`}
                  aria-label={`Select ${d.name}`}
                >
                  <span 
                    className={`w-2.5 h-2.5 rounded-sm transition-all duration-300 shrink-0 ${
                      isActive 
                        ? 'bg-forest-deep ring-2 ring-forest-deep/15 scale-110' 
                        : 'bg-sage-muted/40'
                    }`} 
                  />
                  <span className={`text-[9.5px] font-mono uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? 'text-forest-deep font-bold' : 'text-sage-muted/80'
                  }`}>
                    {d.label} <span className="opacity-50 font-sans font-normal">({d.multiplier}x)</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tooltip overlay on top corner of chart */}
        <div className="h-6 flex justify-between items-center text-[10px] text-sage-muted font-sans border-t border-sage-muted/5 pt-2">
          <span>💡 Tap bars or legend to switch spec</span>
          {hoveredData ? (
            <span className="text-forest-deep font-bold transition-all animate-pulse">
              {hoveredData.name}: {formatToIndianLakhs(hoveredData.costLower)} - {formatToIndianLakhs(hoveredData.costUpper)}
            </span>
          ) : (
            <span className="italic">Hover bars for estimates</span>
          )}
        </div>
      </div>

      {/* Breakdown below the bar chart comparing details for the selected tier */}
      {activePoints && (
        <div className="space-y-4 animation-fade-in text-forest-deep">
          {/* Estimated internal turnkey scope and cost builder */}
          <div className="border-b border-sage-muted/10 pb-3">
            <span className="text-[10px] text-sage-muted block font-label-caps tracking-wider uppercase mb-1">
              {activePoints.name} Est. Turnkey Cost (Material + Labor)
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-forest-deep block">
              {formatToIndianLakhs(activePoints.costLower)} - {formatToIndianLakhs(activePoints.costUpper)}
            </span>
            <div className="flex justify-between items-center mt-1 text-[11px] text-on-surface-variant font-mono">
              <span>Avg Rate: ~₹{Math.round(activePoints.estimatedCost / squareFootage)} / sq.ft.</span>
              <span>Footprint: {squareFootage.toLocaleString('en-IN')} sq.ft.</span>
            </div>
          </div>

          {/* Sourcing details and contracting BOQ breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-label-caps text-sage-muted tracking-widest uppercase font-bold">Estimated Turnkey Indian BOQ Split</h4>
            
            <div className="space-y-2">
              {[
                { label: 'Modular Woodwork & Carpentry (50%)', cost: activePoints.estimatedCost * 0.50, detail: 'Marine Ply, Veneers, Soft-close fittings' },
                { label: 'Civil, Flooring & Stone Claddings (20%)', cost: activePoints.estimatedCost * 0.20, detail: 'Floor layouts, Italian marble highlights' },
                { label: 'False Ceiling, MEP & Electricals (15%)', cost: activePoints.estimatedCost * 0.15, detail: 'Gypsum board ceiling, LED profiles, wiring' },
                { label: 'Branded Paints & Wall Textures (15%)', cost: activePoints.estimatedCost * 0.15, detail: 'Royale wash, lime plaster accents' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 p-2 bg-cream-soft/20 rounded border border-sage-muted/5">
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] font-sans font-medium block leading-tight">{item.label}</span>
                    <span className="text-[9.5px] font-mono text-sage-muted block">{item.detail}</span>
                  </div>
                  <span className="text-[11.5px] font-mono font-bold shrink-0">{formatToIndianLakhs(item.cost)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="bg-cream-soft/10 p-3 rounded-lg border border-sage-muted/5">
              <span className="text-[9.5px] text-sage-muted block uppercase tracking-widest mb-1 font-label-caps">
                Engineering Drafting
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-forest-deep block flex items-center gap-1.5 leading-none">
                <Clock className="w-3.5 h-3.5 text-forest-deep shrink-0" />
                {activePoints.hours} Hours
              </span>
            </div>
            <div className="bg-cream-soft/10 p-3 rounded-lg border border-sage-muted/5">
              <span className="text-[9.5px] text-sage-muted block uppercase tracking-widest mb-1 font-label-caps">
                Artisan Materials
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-forest-deep block flex items-center gap-1.5 leading-none">
                <Layers className="w-3.5 h-3.5 text-forest-deep shrink-0" />
                {Math.round(5 + (squareFootage / 500) * (activeTier === 'prestige' ? 1.6 : 1.0))} BOQ Lines
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
