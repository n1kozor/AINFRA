import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { DeviceAvailabilityStats, CheckStatus, DeviceAvailabilityResult } from '../types/availability';

export const useAvailability = () => {
  const queryClient = useQueryClient();

  // Összes eszköz elérhetőségének lekérdezése - ezt már nem használjuk közvetlenül
  const useAllDevicesAvailability = (refreshKey: number) => {
    return useQuery({
      queryKey: ['availabilityAll', refreshKey],
      queryFn: () => api.availability.checkAllDevices(50),
      enabled: false, // Disabled by default to prevent automatic execution
    });
  };

  // Aktuális elérhetőségi adatok lekérdezése - optimalizált, gyors
  const useLatestAvailabilityData = () => {
    return useQuery({
      queryKey: ['availabilityLatest'],
      queryFn: api.availability.getLatestAvailability,
      staleTime: 60 * 1000, // 1 perc
      retry: 1,             // Csak egyszer próbálja újra
      retryDelay: 1000,     // 1 másodperc után
      refetchOnWindowFocus: false,  // Ne frissítsen ablak fókuszkor
    });
  };

  // Streaming elérhetőségi adatok lekérdezése - a folyamatban lévő ellenőrzési eredmények
  const useCheckResults = (refreshInterval: number = 2000, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['availabilityResults'],
      queryFn: api.availability.getCheckResults,
      refetchInterval: enabled ? refreshInterval : false,
      refetchIntervalInBackground: true,
      enabled,
    });
  };

  // Ellenőrzési folyamat állapotának lekérdezése
  const useCheckStatus = (refreshInterval: number = 2000) => {
    return useQuery({
      queryKey: ['availabilityCheckStatus'],
      queryFn: api.availability.getCheckStatus,
      refetchInterval: (data: CheckStatus) => {
        // Ha folyamatban van, gyakran frissítsünk, egyébként ne
        return data?.in_progress ? refreshInterval : false;
      },
      refetchIntervalInBackground: true,
    });
  };

  // Egy eszköz elérhetőségi előzményeinek lekérdezése
  const useDeviceAvailabilityHistory = (deviceId: number, limit: number = 100, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['availabilityHistory', deviceId, limit],
      queryFn: () => api.availability.getDeviceHistory(deviceId, limit),
      enabled,
    });
  };

  // Diagram adatok lekérdezése
  const useDeviceAvailabilityChart = (deviceId: number, days: number = 7, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['availabilityChart', deviceId, days],
      queryFn: () => api.availability.getChartData(deviceId, days),
      enabled,
    });
  };

  // Elérhetőség-ellenőrzés manuális indítása - magas párhuzamossággal
  const useRunAvailabilityChecks = () => {
    return useMutation({
      mutationFn: (maxConcurrent: number = 100) => api.availability.runChecks(maxConcurrent),
      onSuccess: () => {
        // Sikeres indítás után frissítsük az állapotot
        queryClient.invalidateQueries({ queryKey: ['availabilityCheckStatus'] });
      },
    });
  };

  // Elérhetőségi beállítások lekérdezése
  const useAvailabilitySettings = () => {
    return useQuery({
      queryKey: ['availabilitySettings'],
      queryFn: api.availability.getSettings,
    });
  };

  // Elérhetőségi beállítások frissítése
  const useUpdateAvailabilitySettings = () => {
    return useMutation({
      mutationFn: api.availability.updateSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['availabilitySettings'] });
      },
    });
  };

  // Eszközök elérhetőségi statisztikáinak kiszámítása
  const calculateAvailabilityStats = (availabilityData: DeviceAvailabilityResult[] | undefined): DeviceAvailabilityStats => {
    if (!availabilityData || availabilityData.length === 0) {
      return {
        totalDevices: 0,
        availableDevices: 0,
        unavailableDevices: 0,
        uptimePercent: 0,
      };
    }

    const totalDevices = availabilityData.length;
    const availableDevices = availabilityData.filter(device => device.is_available).length;
    const unavailableDevices = totalDevices - availableDevices;
    const uptimePercent = totalDevices > 0 ? (availableDevices / totalDevices) * 100 : 0;

    return {
      totalDevices,
      availableDevices,
      unavailableDevices,
      uptimePercent: Math.round(uptimePercent),
    };
  };

  // Eszközök elérhetőségi adatainak összefésülése
  // Ez kombinálja a legutolsó ismert állapotokat és a folyamatban lévő ellenőrzések eredményeit
  const mergeAvailabilityData = (
    latestData: DeviceAvailabilityResult[] | undefined,
    streamingResults: DeviceAvailabilityResult[] | undefined
  ): DeviceAvailabilityResult[] => {
    if (!latestData) return streamingResults || [];
    if (!streamingResults) return latestData;

    // Másolat készítése, hogy ne módosítsuk az eredeti adatokat
    const result = [...latestData];

    // Map a gyorsabb keresés érdekében
    const deviceMap = new Map(result.map(device => [device.device_id, device]));

    // Frissítsük az adatokat a streaming eredményekkel
    streamingResults.forEach(device => {
      const existingDevice = deviceMap.get(device.device_id);
      if (existingDevice) {
        const existingTimestamp = new Date(existingDevice.timestamp).getTime();
        const newTimestamp = new Date(device.timestamp).getTime();

        // Csak akkor frissítsünk, ha az új adat frissebb
        if (newTimestamp > existingTimestamp) {
          const index = result.findIndex(d => d.device_id === device.device_id);
          if (index !== -1) {
            result[index] = device;
          }
        }
      } else {
        // Ha még nincs ilyen eszköz, adjuk hozzá
        result.push(device);
      }
    });

    return result;
  };

  return {
    useAllDevicesAvailability,
    useLatestAvailabilityData,
    useCheckResults,
    useCheckStatus,
    useDeviceAvailabilityHistory,
    useDeviceAvailabilityChart,
    useRunAvailabilityChecks,
    useAvailabilitySettings,
    useUpdateAvailabilitySettings,
    calculateAvailabilityStats,
    mergeAvailabilityData,
  };
};