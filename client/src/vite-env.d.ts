/// <reference types="vite/client" />

declare module "streamdown" {
  export const Streamdown: any;
}

declare namespace google {
  export namespace maps {
    export class Map {
      constructor(mapDiv: Element | null, opts?: any);
    }
    export type LatLngLiteral = { lat: number; lng: number };
  }
}
