import { useEffect, useRef } from "react";

export function FlightScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactScreen = window.matchMedia("(max-width: 899px)").matches;
    if (reduceMotion || compactScreen || !host.current) return;

    let mounted = true;
    let frame = 0;
    let timer = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;

    const start = async () => {
      const THREE = await import("three");
      if (!mounted || !host.current) return;
      const container = host.current;
      const scene = new THREE.Scene();
      const aspect = container.clientWidth / container.clientHeight;
      const camera = new THREE.OrthographicCamera(-aspect * 2, aspect * 2, 2, -2, 0.1, 50);
      camera.position.set(0, 0, 5);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.setAttribute("role", "presentation");
      container.appendChild(renderer.domElement);
      container.classList.add("has-webgl");

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-9.4, 1.38, 0), new THREE.Vector3(-6.4, 1.86, -0.15),
        new THREE.Vector3(-3.2, 1.52, 0.14), new THREE.Vector3(0.35, 1.92, -0.12),
        new THREE.Vector3(4.2, 1.58, 0.08), new THREE.Vector3(9.4, 1.94, 0),
      ]);
      const routePoints = curve.getPoints(96);
      const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
      const routeLine = new THREE.Line(routeGeometry, new THREE.LineBasicMaterial({ color: 0xd0ad58, transparent: true, opacity: 0.92 }));
      routeLine.frustumCulled = false;
      scene.add(routeLine);

      const origin = new THREE.Mesh(new THREE.CircleGeometry(0.055, 16), new THREE.MeshBasicMaterial({ color: 0xf5df9c }));
      const destination = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.085, 20), new THREE.MeshBasicMaterial({ color: 0xd0ad58, transparent: true, opacity: 0.8 }));
      origin.position.copy(routePoints[0]);
      destination.position.copy(routePoints[routePoints.length - 1]);
      scene.add(origin, destination);

      const aircraft = new THREE.Group();
      aircraft.scale.setScalar(2.15);
      const aircraftMaterial = new THREE.MeshBasicMaterial({ color: 0xffedb0, side: THREE.DoubleSide });
      const planeShape = new THREE.Shape();
      planeShape.moveTo(0.42, 0); planeShape.lineTo(0.12, 0.07); planeShape.lineTo(0.02, 0.28); planeShape.lineTo(-0.08, 0.28); planeShape.lineTo(-0.04, 0.08); planeShape.lineTo(-0.25, 0.06); planeShape.lineTo(-0.38, 0.16); planeShape.lineTo(-0.44, 0.13); planeShape.lineTo(-0.30, 0); planeShape.lineTo(-0.44, -0.13); planeShape.lineTo(-0.38, -0.16); planeShape.lineTo(-0.25, -0.06); planeShape.lineTo(-0.04, -0.08); planeShape.lineTo(-0.08, -0.28); planeShape.lineTo(0.02, -0.28); planeShape.lineTo(0.12, -0.07); planeShape.lineTo(0.42, 0);
      const silhouette = new THREE.Mesh(new THREE.ShapeGeometry(planeShape), aircraftMaterial);
      const glow = new THREE.Mesh(new THREE.CircleGeometry(0.16, 24), new THREE.MeshBasicMaterial({ color: 0xb8912f, transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
      glow.position.z = -0.02;
      aircraft.add(glow, silhouette);
      scene.add(aircraft);

      const resize = () => {
        if (!renderer || !host.current) return;
        const nextAspect = host.current.clientWidth / host.current.clientHeight;
        camera.left = -nextAspect * 2;
        camera.right = nextAspect * 2;
        camera.updateProjectionMatrix();
        renderer.setSize(host.current.clientWidth, host.current.clientHeight);
      };
      observer = new ResizeObserver(resize);
      observer.observe(container);

      let startedAt = 0;
      const render = (time: number) => {
        if (!startedAt) startedAt = time;
        const cycle = ((time - startedAt) * 0.00007) % 1;
        routeGeometry.setDrawRange(0, routePoints.length);
        const flightProgress = Math.min(cycle / 0.88, 1);
        aircraft.visible = true;
        // The group origin is the aircraft center; position and heading share the exact same curve sample.
        const routePoint = curve.getPointAt(flightProgress);
        const tangent = curve.getTangentAt(flightProgress).normalize();
        aircraft.position.copy(routePoint);
        aircraft.rotation.z = Math.atan2(tangent.y, tangent.x);
        aircraft.rotation.y = Math.sin(time * 0.0015) * 0.06;
        const arrivalPulse = cycle > 0.78 ? 1 + Math.sin(time * 0.008) * 0.25 : 1;
        destination.scale.setScalar(arrivalPulse);
        destination.material.opacity = cycle > 0.78 ? 0.9 : 0.58;
        renderer?.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
    };

    timer = window.setTimeout(start, 80);
    return () => {
      mounted = false;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      renderer?.dispose();
      if (renderer?.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
      host.current?.classList.remove("has-webgl");
    };
  }, []);

  return (
    <div ref={host} className="flight-scene" aria-hidden="true">
      <svg className="flight-fallback" viewBox="0 0 1200 360" role="presentation" focusable="false">
        <path className="flight-fallback-route flight-fallback-route-main" d="M30 42 C150 0 270 34 405 12 S650 4 790 24 S1010 42 1170 8" />
        <path className="flight-fallback-route flight-fallback-route-echo" d="M30 58 C154 10 268 48 405 28 S650 18 790 42 S1010 58 1170 18" />
        <circle className="flight-fallback-origin" cx="30" cy="42" r="8" />
        <circle className="flight-fallback-destination" cx="1170" cy="8" r="12" />
        <g className="flight-fallback-plane" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <path className="plane-fuselage" d="M42 0 C27 -5 13 -5 0 -3 L-18 -7 L-30 -4 L-19 0 L-30 4 L-18 7 L0 3 C13 5 27 5 42 0 Z" />
          <path className="plane-wing" d="M7 -2 L-10 -32 L-17 -33 L-11 -3 Z M7 2 L-10 32 L-17 33 L-11 3 Z" />
          <path className="plane-tail" d="M-21 -2 L-31 -19 L-37 -19 L-31 -1 Z M-21 2 L-31 19 L-37 19 L-31 1 Z" />
          <circle className="plane-window" cx="17" cy="0" r="2.5" />
          <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" path="M30 92 C150 0 270 82 405 26 S650 8 790 58 S1010 92 1170 16" />
        </g>
      </svg>
    </div>
  );
}
