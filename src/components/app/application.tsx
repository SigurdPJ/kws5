import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import { WMTS } from "ol/source.js";
import { useGeographic } from "ol/proj.js";

// @ts-ignore
import "ol/ol.css";
import { GeoJSON, WMTSCapabilities } from "ol/format.js";
import { optionsFromCapabilities } from "ol/source/WMTS.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";

useGeographic();

const kartverket = new TileLayer({});
const kartverketUrl =
  "https://cache.kartverket.no/v1/wmts/1.0.0/WMTSCapabilities.xml";
fetch(kartverketUrl).then(async (response) => {
  const parser = new WMTSCapabilities();
  kartverket.setSource(
    new WMTS(
      optionsFromCapabilities(parser.read(await response.text()), {
        layer: "toporaster",
        matrixSet: "webmercator",
      })!,
    ),
  );
});

const kommuneSource = new VectorSource({
  url: "/kws5/geojson/kommuner.geojson",
  format: new GeoJSON(),
});
const kommuneLayer = new VectorLayer({
  source: kommuneSource,
});

const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 13 }),
  layers: [kartverket, kommuneLayer],
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  return <div ref={mapRef}></div>;
}
