import { LeaveStatus } from "../../types/leave";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "present":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "late":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "absent":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "partial":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "holiday":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getLeaveStatusColor = (status: LeaveStatus) => {
  switch (status) {
    case "approved":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "rejected":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "cancelled":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "withdrawn":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const formatTime = (time: Date) => {
  return time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
  address: string;
} | null> => {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    console.warn("Geolocation is not supported by this browser");
    // Use mock location for demo
    return {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Office Street, New York, NY (Demo Location)",
    };
  }

  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      }
    );

    const { latitude, longitude } = position.coords;

    // Mock reverse geocoding (in real app, use Google Maps API or similar)
    const address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;

    return { latitude, longitude, address };
  } catch (err: unknown) {
    let errorMessage = "Location access failed";
    const error = err as { code?: number };

    if (error.code) {
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = "Location access denied by user";
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = "Location information unavailable";
          break;
        case 3: // TIMEOUT
          errorMessage = "Location request timed out";
          break;
        default:
          errorMessage = "Unknown location error";
      }
    }

    console.warn("Location error:", errorMessage, error);

    // Use mock location for demo when real location fails
    return {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Office Street, New York, NY (Demo Location)",
    };
  }
};
