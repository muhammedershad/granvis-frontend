export const getCategoryOptions = (projectType: string) => {
  switch (projectType) {
    case "Villa":
      return [
        "Luxury Residential",
        "Family Home",
        "Vacation Villa",
        "Sustainable Housing",
      ];
    case "Commercial":
      return [
        "Office Building",
        "Retail Complex",
        "Mixed-use Development",
        "Industrial Facility",
      ];
    case "Interior":
      return [
        "Residential Interior",
        "Commercial Interior",
        "Hospitality Design",
        "Office Design",
      ];
    case "Landscape":
      return [
        "Residential Landscape",
        "Commercial Landscape",
        "Urban Planning",
        "Educational Campus",
      ];
    default:
      return [];
  }
};
