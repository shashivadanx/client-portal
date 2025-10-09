import { create } from "zustand";
import type { ClientPortalSubmission } from "../components/table";

type DialogType = "details" | "comparison" | null;
type comparisonColsType = 2 | 3 | 4;

interface ClientPortalState {
  isDialogOpen: DialogType;
  setIsDialogOpen: (dialog: DialogType) => void;
  dialogData: ClientPortalSubmission | ClientPortalSubmission[] | null;
  setDialogData: (
    data: ClientPortalSubmission | ClientPortalSubmission[] | null
  ) => void;
  comparisonCols: comparisonColsType;
  setComparisonCols: (cols: comparisonColsType) => void;
}

export const useClientPortalStore = create<ClientPortalState>((set) => ({
  isDialogOpen: null,
  setIsDialogOpen: (dialog) => set({ isDialogOpen: dialog }),
  dialogData: null,
  setDialogData: (data) => set({ dialogData: data }),
  comparisonCols: 2,
  setComparisonCols: (cols) => set({ comparisonCols: cols }),
}));
