export const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page || "1", 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || "10", 10), 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildListingFilter = (query) => {
  const filter = { status: "available" };

  if (query.cropType) {
    filter.cropType = query.cropType;
  }

  if (query.location) {
    filter.location = { $regex: `^${query.location}$`, $options: "i" };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  return filter;
};
