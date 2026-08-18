"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
type GlobeOProps = {
  label?: string;
};

export function GlobeO({ label = "Globe interactif" }: GlobeOProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoOrthographic(),
        panX: "none",
        panY: "none",
        wheelY: "none",
        minZoomLevel: 0.9,
        maxZoomLevel: 4,
        maxPanOut: 0.25,
        rotationX: -18,
        rotationY: -12,
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        focusable: false,
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
      interactive: false,
      fill: am5.color(0xd6b85c),
      fillOpacity: 0.76,
      stroke: am5.color(0xfff2bd),
      strokeOpacity: 0.28,
      strokeWidth: 0.45,
    });

    const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {
      step: 20,
    }));
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0xf0d991),
      strokeOpacity: 0.17,
      strokeWidth: 0.45,
    });

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

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chart.appear(850, 120);
      startRotation();
    }

    return () => {
      rotationRef.current?.stop();
      root.dispose();
    };
  }, []);

  return (
    <span className="hero-globe-inline" aria-hidden="true" title={label}>
      <span className="hero-globe-canvas" ref={chartRef} aria-hidden="true" />
    </span>
  );
}
