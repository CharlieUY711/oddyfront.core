import { create } from "zustand";

export interface EditorState {
  brightness: number; contrast: number; exposure: number;
  saturation: number; temperature: number; tint: number;
  sharpness: number; blur: number;
  rotation: number; fineRotation: number;
  flipH: boolean; flipV: boolean;
  zoom: number; filter: string;
  src: HTMLImageElement | null;
  bgRemoved: boolean;
  history: { label: string; snap: string }[];
  histIdx: number;
}

export interface EditorActions {
  set: (key: keyof EditorState, value: any) => void;
  setSrc: (img: HTMLImageElement) => void;
  saveHistory: (label: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const DEFAULTS = {
  brightness:0,contrast:0,exposure:0,saturation:0,temperature:0,tint:0,
  sharpness:0,blur:0,rotation:0,fineRotation:0,flipH:false,flipV:false,
  zoom:1,filter:"none",src:null,bgRemoved:false,history:[],histIdx:-1
};

export const useEditorStore = create<EditorState & EditorActions>((s, g) => ({
  ...DEFAULTS,

  set: (key, value) => s({ [key]: value } as any),

  setSrc: (img) => {
    s({ src: img, ...DEFAULTS, history: [], histIdx: -1 });
    setTimeout(() => g().saveHistory("Imagen cargada"), 0);
  },

  saveHistory: (label) => {
    const state = g();
    const snap = JSON.stringify({
      brightness:state.brightness,contrast:state.contrast,exposure:state.exposure,
      saturation:state.saturation,temperature:state.temperature,tint:state.tint,
      sharpness:state.sharpness,blur:state.blur,rotation:state.rotation,
      fineRotation:state.fineRotation,flipH:state.flipH,flipV:state.flipV,
      zoom:state.zoom,filter:state.filter
    });
    let hist = state.history.slice(0, state.histIdx + 1);
    hist = [...hist, { label, snap }].slice(-20);
    s({ history: hist, histIdx: hist.length - 1 });
  },

  undo: () => {
    const { histIdx, history } = g();
    if (histIdx <= 0) return;
    const newIdx = histIdx - 1;
    const snap = JSON.parse(history[newIdx].snap);
    s({ ...snap, histIdx: newIdx });
  },

  redo: () => {
    const { histIdx, history } = g();
    if (histIdx >= history.length - 1) return;
    const newIdx = histIdx + 1;
    const snap = JSON.parse(history[newIdx].snap);
    s({ ...snap, histIdx: newIdx });
  },

  reset: () => {
    s({
      brightness:0,contrast:0,exposure:0,saturation:0,temperature:0,tint:0,
      sharpness:0,blur:0,rotation:0,fineRotation:0,flipH:false,flipV:false,
      zoom:1,filter:"none"
    });
    setTimeout(() => g().saveHistory("Reset"), 0);
  }
}));
