import mapboxgl from "mapbox-gl";



export function applyMuulMapStyle(map: mapboxgl.Map) {
  const layers = map.getStyle()?.layers ?? [];

  layers.forEach((layer) => {
    const id = layer.id;
    const type = layer.type;


    if (id === "land" || id === "background") {
      try { map.setPaintProperty(id, "background-color", "#dce8f5"); } catch {}
    }


    if (id.includes("water") && !id.includes("waterway") && type === "fill") {
      try { map.setPaintProperty(id, "fill-color", "#9ec8de"); } catch {}
    }
    if (id.includes("waterway") && type === "line") {
      try { map.setPaintProperty(id, "line-color", "#9ec8de"); } catch {}
    }


    if (id.includes("landuse") || id.includes("land-use")) {
      if (type === "fill") {
        try { map.setPaintProperty(id, "fill-color", "#cddff0"); } catch {}
      }
    }


    if ((id.includes("road") || id.includes("street") || id.includes("motorway") || id.includes("trunk")) && type === "line") {
      try {

        if (id.includes("motorway") || id.includes("trunk") || id.includes("primary")) {
          map.setPaintProperty(id, "line-color", "#ffffff");
        } else if (id.includes("secondary") || id.includes("tertiary")) {
          map.setPaintProperty(id, "line-color", "#f0f5ff");
        } else {
          map.setPaintProperty(id, "line-color", "#eaf1fb");
        }
      } catch {}
    }


    if (id.includes("casing") && type === "line") {
      try { map.setPaintProperty(id, "line-color", "#c5d8ec"); } catch {}
    }


    if ((id.includes("building") || id.includes("structure")) && type === "fill") {
      try {
        map.setPaintProperty(id, "fill-color", "#ccd9ec");
        map.setPaintProperty(id, "fill-opacity", 0.7);
      } catch {}
    }


    if (type === "symbol") {
      try { map.setPaintProperty(id, "text-opacity", 0.8); } catch {}
    }


    if (id.includes("park") || id.includes("green") || id.includes("pitch")) {
      if (type === "fill") {
        try { map.setPaintProperty(id, "fill-color", "#c5ddc5"); } catch {}
      }
    }
  });
}