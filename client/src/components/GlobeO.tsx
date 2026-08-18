"use client";

import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { useLanguage } from "@/contexts/LanguageContext";

type GlobeOProps = {
  label?: string;
};

export function GlobeO({ label = "Globe interactif" }: GlobeOProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<{ stop: () => void } | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { language } = useLanguage();

  useEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoOrthographic(),
        panX: "rotateX",
        panY: "rotateY",
        wheelY: "zoom",
        wheelSensitivity: 0.7,
        minZoomLevel: 0.9,
        maxZoomLevel: 4,
        maxPanOut: 0.25,
        rotationX: -18,
        rotationY: -12,
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        focusable: true,
      }),
    );

    const backgroundSeries = chart.series.unshift(
      am5map.MapPolygonSeries.new(root, {}),
    );
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x11110f),
      fillOpacity: 0.96,
      stroke: am5.color(0xf0d991),
      strokeOpacity: 0.18,
      strokeWidth: 0.6,
    });
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      }),
    );
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color(0xd6b85c),
      fillOpacity: 0.76,
      stroke: am5.color(0xfff2bd),
      strokeOpacity: 0.28,
      strokeWidth: 0.45,
    });
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xffe483),
      fillOpacity: 1,
      stroke: am5.color(0xfff8d5),
      strokeOpacity: 0.9,
    });
    polygonSeries.mapPolygons.template.states.create("active", {
      fill: am5.color(0xffefaa),
      fillOpacity: 1,
      stroke: am5.color(0xffffff),
      strokeOpacity: 1,
      strokeWidth: 1.2,
    });
    polygonSeries.mapPolygons.template.events.on("click", (event) => {
      const dataContext = event.target.dataItem?.dataContext as
        | { id?: string; name?: string }
        | undefined;
      const country = dataContext?.name || dataContext?.id || "";
      if (country) setSelectedCountry(country);
      event.target.set("active", true);
    });

    const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {
      step: 20,
    }));
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0xf0d991),
      strokeOpacity: 0.17,
      strokeWidth: 0.45,
    });

    const stopRotation = () => {
      rotationRef.current?.stop();
      rotationRef.current = null;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };

    const startRotation = () => {
      rotationRef.current?.stop();
      const current = chart.get("rotationX") || -18;
      rotationRef.current = chart.animate({
        key: "rotationX",
        from: current,
        to: current + 360,
        duration: 30000,
        loops: Infinity,
        easing: am5.ease.linear,
      });
    };

    chart.chartContainer.events.on("pointerdown", stopRotation);
    chart.chartContainer.events.on("pointerup", () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = window.setTimeout(startRotation, 1800);
    });

    chart.appear(850, 120);
    startRotation();

    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      rotationRef.current?.stop();
      root.dispose();
    };
  }, []);

  return (
    <span
      className="hero-globe-inline"
      role="group"
      aria-label={label}
      title={selectedCountry || label}
    >
      <span className="hero-globe-canvas" ref={chartRef} aria-hidden="true" />
      {selectedCountry && <span className="hero-globe-selected" aria-live="polite">{selectedCountry}</span>}
    </span>
  );
}
