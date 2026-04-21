import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

interface GoogleAntigravityProps {
  onExit: () => void;
}

const GoogleAntigravity: React.FC<GoogleAntigravityProps> = ({ onExit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Layout Data simulating Google Homepage
  const navLinks = ["Gmail", "Imagens"];
  const footerLeft = ["Publicidade", "Negócios", "Sobre", "Como funciona a Pesquisa"];
  const footerRight = ["Privacidade", "Termos", "Configurações"];

  const startGravity = () => {
    if (isActive || !containerRef.current) return;
    setIsActive(true);

    // 1. Setup Matter.js
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Events = Matter.Events;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    // Set gravity (Standard Google Gravity pulls down, Antigravity floats)
    // Let's start with Gravity (Down) as it's the classic "Break" effect.
    engine.gravity.y = 1; 

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 2. Create Boundaries (Walls)
    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, render: { visible: false } });
    const ceiling = Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true, render: { visible: false } });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true, render: { visible: false } });

    Composite.add(world, [ground, ceiling, leftWall, rightWall]);

    // 3. Convert DOM Elements to Physics Bodies
    const bodies: Matter.Body[] = [];
    const domElements: HTMLElement[] = [];

    elementsRef.current.forEach((el) => {
      if (!el) return;
      
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Create physical body matching the DOM element
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.8, // Bouncy
        friction: 0.1,
        frictionAir: 0.01,
        angle: 0
      });

      bodies.push(body);
      domElements.push(el);

      // Lock DOM element to absolute position immediately to prevent layout shifts
      el.style.position = 'absolute';
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      // We set transform initially to where it was
      el.style.transform = `translate(${x - rect.width/2}px, ${y - rect.height/2}px)`;
    });

    Composite.add(world, bodies);

    // 4. Mouse Control (To throw elements around)
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(world, mouseConstraint);

    // 5. Sync Loop (Physics -> DOM)
    Events.on(engine, 'afterUpdate', () => {
      bodies.forEach((body, index) => {
        const el = domElements[index];
        if (el) {
          const { x, y } = body.position;
          const angle = body.angle;
          // Apply transform. Note: Matter.js origin is center of mass.
          // Translate needs to move top-left corner to correct position.
          // However, since we set width/height, we can translate to center then offset?
          // Easier: translate to body.position.x - width/2
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          el.style.transform = `translate(${x - w/2}px, ${y - h/2}px) rotate(${angle}rad)`;
        }
      });
    });

    // 6. Run
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  // Toggle Gravity Mode
  const toggleZeroG = () => {
      if(engineRef.current) {
          const currentY = engineRef.current.gravity.y;
          engineRef.current.gravity.y = currentY === 0 ? 1 : 0;
          engineRef.current.gravity.x = 0;
      }
  };

  return (
    <div 
        ref={containerRef}
        className="fixed inset-0 bg-white font-sans text-xs overflow-hidden select-none"
        onClick={!isActive ? startGravity : undefined}
    >
        {/* Navigation Bar */}
        <div className="flex justify-end items-center p-4 gap-4 h-16 w-full absolute top-0 right-0 z-10 pointer-events-none">
            {navLinks.map((text, i) => (
                <a key={i} ref={addToRefs} className="hover:underline cursor-pointer text-gray-600 pointer-events-auto">
                    {text}
                </a>
            ))}
            <div ref={addToRefs} className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center pointer-events-auto cursor-pointer font-bold">
                M
            </div>
        </div>

        {/* Center Content */}
        <div className={`flex flex-col items-center w-full absolute top-[30%] left-0 transition-opacity ${isActive ? '' : 'pointer-events-none'}`}>
            {/* Logo */}
            <div ref={addToRefs} className="mb-8 pointer-events-auto">
                <span className="text-[90px] font-medium tracking-tighter" style={{ fontFamily: 'Product Sans, Arial, sans-serif' }}>
                    <span className="text-[#4285f4]">G</span>
                    <span className="text-[#ea4335]">o</span>
                    <span className="text-[#fbbc05]">o</span>
                    <span className="text-[#4285f4]">g</span>
                    <span className="text-[#34a853]">l</span>
                    <span className="text-[#ea4335]">e</span>
                </span>
                <span className="text-gray-400 text-xl ml-2 block text-right -mt-4 transform rotate-12">Gravity</span>
            </div>

            {/* Search Input */}
            <div ref={addToRefs} className="w-[584px] max-w-[90vw] h-[46px] rounded-full border border-gray-200 shadow-sm hover:shadow-md flex items-center px-4 gap-4 bg-white mb-8 pointer-events-auto">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
                <input 
                    type="text" 
                    className="flex-1 outline-none text-base text-black" 
                    placeholder="Programar Google Antigravity..."
                    disabled // Disable input to avoid focus trapping physics objects
                />
                <i className="fa-solid fa-microphone text-blue-500"></i>
                <i className="fa-solid fa-camera text-blue-500"></i>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pointer-events-auto">
                <button ref={addToRefs} className="px-4 py-2 bg-[#f8f9fa] border border-[#f8f9fa] rounded text-gray-800 hover:shadow hover:border-[#dadce0] text-sm">
                    Pesquisa Google
                </button>
                <button ref={addToRefs} onClick={toggleZeroG} className="px-4 py-2 bg-[#f8f9fa] border border-[#f8f9fa] rounded text-gray-800 hover:shadow hover:border-[#dadce0] text-sm">
                    Estou com Sorte (Zero G)
                </button>
                <button ref={addToRefs} onClick={onExit} className="px-4 py-2 bg-[#f8f9fa] border border-[#f8f9fa] rounded text-gray-800 hover:shadow hover:border-[#dadce0] text-sm">
                    Voltar para MKT4IA
                </button>
            </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full bg-[#f2f2f2] border-t border-[#dadce0] flex flex-col pointer-events-none">
             <div className="px-8 py-3 border-b border-[#dadce0]">
                 <span ref={addToRefs} className="text-gray-500 text-[15px] pointer-events-auto">Brasil</span>
             </div>
             <div className="px-8 py-3 flex flex-wrap justify-between">
                 <div className="flex gap-6">
                    {footerLeft.map((text, i) => (
                        <a key={i} ref={addToRefs} className="hover:underline cursor-pointer text-gray-500 pointer-events-auto">{text}</a>
                    ))}
                 </div>
                 <div className="flex gap-6">
                    {footerRight.map((text, i) => (
                        <a key={i} ref={addToRefs} className="hover:underline cursor-pointer text-gray-500 pointer-events-auto">{text}</a>
                    ))}
                 </div>
             </div>
        </div>

        {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                 <div className="bg-black/80 text-white px-6 py-3 rounded-full animate-pulse">
                    Clique em qualquer lugar para iniciar a Gravidade
                 </div>
            </div>
        )}
    </div>
  );
};

export default GoogleAntigravity;