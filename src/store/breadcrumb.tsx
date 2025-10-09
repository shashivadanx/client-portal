import { create } from "zustand";

export type Breadcrumb = {
  title: string;
  id: string;
};

export type BreadcrumbStore = {
  breadcrumb: Breadcrumb[];
  hiddenBreadcrumbSegments: string[];
  setBreadcrumb: (breadcrumb: Breadcrumb) => void;
  setHiddenBreadcrumbSegments: (hiddenBreadcrumbSegments: string[]) => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumb: [],
  hiddenBreadcrumbSegments: [],
  setBreadcrumb: (breadcrumb: Breadcrumb) =>
    set((state) => ({ breadcrumb: [...state.breadcrumb, breadcrumb] })),
  setHiddenBreadcrumbSegments: (hiddenBreadcrumbSegments) =>
    set(() => ({ hiddenBreadcrumbSegments: [...hiddenBreadcrumbSegments] })),
}));
