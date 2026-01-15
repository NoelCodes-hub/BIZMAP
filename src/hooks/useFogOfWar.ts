import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CELL_SIZE = 0.005; // ~500m grid cells

interface ExploredCell {
  cell_x: number;
  cell_y: number;
}

export const useFogOfWar = () => {
  const [exploredCells, setExploredCells] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [totalExplored, setTotalExplored] = useState(0);

  const getCellKey = (x: number, y: number) => `${x},${y}`;

  const coordsToCell = useCallback((lat: number, lng: number) => {
    return {
      x: Math.floor(lng / CELL_SIZE),
      y: Math.floor(lat / CELL_SIZE)
    };
  }, []);

  const cellToCoords = useCallback((x: number, y: number) => {
    return {
      lat: y * CELL_SIZE,
      lng: x * CELL_SIZE
    };
  }, []);

  const fetchExploredCells = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('explored_cells')
        .select('cell_x, cell_y')
        .eq('user_id', user.id);

      if (error) throw error;

      const cells = new Set((data || []).map((c: ExploredCell) => getCellKey(c.cell_x, c.cell_y)));
      setExploredCells(cells);
      setTotalExplored(cells.size);
    } catch (error) {
      console.error('Error fetching explored cells:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exploreLocation = useCallback(async (lat: number, lng: number) => {
    const { x, y } = coordsToCell(lat, lng);
    const key = getCellKey(x, y);

    if (exploredCells.has(key)) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('explored_cells')
        .insert({
          user_id: user.id,
          cell_x: x,
          cell_y: y
        });

      if (error) {
        if (error.code === '23505') return false; // Duplicate
        throw error;
      }

      setExploredCells(prev => new Set([...prev, key]));
      setTotalExplored(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error exploring cell:', error);
      return false;
    }
  }, [exploredCells, coordsToCell]);

  const isExplored = useCallback((lat: number, lng: number) => {
    const { x, y } = coordsToCell(lat, lng);
    return exploredCells.has(getCellKey(x, y));
  }, [exploredCells, coordsToCell]);

  const getExploredCellBounds = useCallback(() => {
    return Array.from(exploredCells).map(key => {
      const [x, y] = key.split(',').map(Number);
      const { lat, lng } = cellToCoords(x, y);
      return {
        south: lat,
        north: lat + CELL_SIZE,
        west: lng,
        east: lng + CELL_SIZE
      };
    });
  }, [exploredCells, cellToCoords]);

  useEffect(() => {
    fetchExploredCells();
  }, [fetchExploredCells]);

  return {
    exploredCells,
    totalExplored,
    isLoading,
    exploreLocation,
    isExplored,
    getExploredCellBounds,
    coordsToCell,
    cellToCoords,
    CELL_SIZE,
    refreshExplored: fetchExploredCells
  };
};
