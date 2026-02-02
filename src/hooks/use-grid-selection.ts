"use client";

import { useState, useCallback, useRef } from "react";

interface GridSelectionState {
  isSelecting: boolean;
  selectionMode: "select" | "deselect" | null;
  startCell: string | null;
  currentCell: string | null;
}

interface UseGridSelectionOptions {
  initialSelection?: Set<string>;
  onSelectionChange?: (selection: Set<string>) => void;
  tapToToggle?: boolean; // Mobile mode: tap to toggle instead of drag
}

export function useGridSelection(options: UseGridSelectionOptions = {}) {
  const { initialSelection = new Set(), onSelectionChange, tapToToggle = false } = options;

  const [selectedCells, setSelectedCells] = useState<Set<string>>(initialSelection);
  const [state, setState] = useState<GridSelectionState>({
    isSelecting: false,
    selectionMode: null,
    startCell: null,
    currentCell: null,
  });

  const pendingSelection = useRef<Set<string>>(new Set());
  const cellRefs = useRef<Map<string, DOMRect>>(new Map());

  const registerCell = useCallback((cellId: string, rect: DOMRect) => {
    cellRefs.current.set(cellId, rect);
  }, []);

  const getCellsInRect = useCallback(
    (startId: string, endId: string, allCellIds: string[]): string[] => {
      const startRect = cellRefs.current.get(startId);
      const endRect = cellRefs.current.get(endId);

      if (!startRect || !endRect) return [startId];

      const minX = Math.min(startRect.left, endRect.left);
      const maxX = Math.max(startRect.right, endRect.right);
      const minY = Math.min(startRect.top, endRect.top);
      const maxY = Math.max(startRect.bottom, endRect.bottom);

      return allCellIds.filter((cellId) => {
        const rect = cellRefs.current.get(cellId);
        if (!rect) return false;

        const cellCenterX = rect.left + rect.width / 2;
        const cellCenterY = rect.top + rect.height / 2;

        return (
          cellCenterX >= minX &&
          cellCenterX <= maxX &&
          cellCenterY >= minY &&
          cellCenterY <= maxY
        );
      });
    },
    []
  );

  const handleTap = useCallback(
    (cellId: string) => {
      const newSelection = new Set(selectedCells);
      if (newSelection.has(cellId)) {
        newSelection.delete(cellId);
      } else {
        newSelection.add(cellId);
      }
      setSelectedCells(newSelection);
      onSelectionChange?.(newSelection);
    },
    [selectedCells, onSelectionChange]
  );

  const handleMouseDown = useCallback(
    (cellId: string) => {
      if (tapToToggle) {
        handleTap(cellId);
        return;
      }

      const isCurrentlySelected = selectedCells.has(cellId);
      const mode = isCurrentlySelected ? "deselect" : "select";

      setState({
        isSelecting: true,
        selectionMode: mode,
        startCell: cellId,
        currentCell: cellId,
      });

      pendingSelection.current = new Set([cellId]);
    },
    [selectedCells, tapToToggle, handleTap]
  );

  const handleMouseEnter = useCallback(
    (cellId: string, allCellIds: string[]) => {
      if (!state.isSelecting || !state.startCell) return;

      setState((prev) => ({ ...prev, currentCell: cellId }));

      const cellsInRect = getCellsInRect(state.startCell, cellId, allCellIds);
      pendingSelection.current = new Set(cellsInRect);
    },
    [state.isSelecting, state.startCell, getCellsInRect]
  );

  const handleMouseUp = useCallback(() => {
    if (!state.isSelecting) return;

    const newSelection = new Set(selectedCells);

    pendingSelection.current.forEach((cellId) => {
      if (state.selectionMode === "select") {
        newSelection.add(cellId);
      } else {
        newSelection.delete(cellId);
      }
    });

    setSelectedCells(newSelection);
    onSelectionChange?.(newSelection);

    setState({
      isSelecting: false,
      selectionMode: null,
      startCell: null,
      currentCell: null,
    });

    pendingSelection.current = new Set();
  }, [state.isSelecting, state.selectionMode, selectedCells, onSelectionChange]);

  const handleTouchStart = useCallback(
    (cellId: string, e: React.TouchEvent) => {
      if (tapToToggle) {
        // In tap mode, just toggle the cell and allow normal page scrolling
        handleTap(cellId);
        return;
      }
      e.preventDefault();
      handleMouseDown(cellId);
    },
    [handleMouseDown, tapToToggle, handleTap]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent, allCellIds: string[]) => {
      // In tap mode, don't do drag selection - allow normal scrolling
      if (tapToToggle) return;
      if (!state.isSelecting) return;

      e.preventDefault();
      const touch = e.touches[0];

      for (const [cellId, rect] of cellRefs.current) {
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          handleMouseEnter(cellId, allCellIds);
          break;
        }
      }
    },
    [state.isSelecting, handleMouseEnter, tapToToggle]
  );

  const handleTouchEnd = useCallback(() => {
    if (tapToToggle) return; // No-op in tap mode
    handleMouseUp();
  }, [handleMouseUp, tapToToggle]);

  const isCellInPendingSelection = useCallback(
    (cellId: string): boolean => {
      return pendingSelection.current.has(cellId);
    },
    []
  );

  const getCellState = useCallback(
    (cellId: string): "selected" | "pending-select" | "pending-deselect" | "none" => {
      const isSelected = selectedCells.has(cellId);
      const isPending = pendingSelection.current.has(cellId);

      if (state.isSelecting && isPending) {
        return state.selectionMode === "select" ? "pending-select" : "pending-deselect";
      }

      return isSelected ? "selected" : "none";
    },
    [selectedCells, state.isSelecting, state.selectionMode]
  );

  const clearSelection = useCallback(() => {
    setSelectedCells(new Set());
    onSelectionChange?.(new Set());
  }, [onSelectionChange]);

  const setSelection = useCallback(
    (selection: Set<string>) => {
      setSelectedCells(selection);
      onSelectionChange?.(selection);
    },
    [onSelectionChange]
  );

  return {
    selectedCells,
    isSelecting: state.isSelecting,
    selectionMode: state.selectionMode,
    registerCell,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getCellState,
    isCellInPendingSelection,
    clearSelection,
    setSelection,
  };
}
