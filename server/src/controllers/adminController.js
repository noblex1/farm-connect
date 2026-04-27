import User from "../models/User.js";
import Listing from "../models/Listing.js";
import MarketPrice from "../models/MarketPrice.js";

export const getAdminStats = async (_req, res, next) => {
  try {
    const [totalUsers, farmers, buyers, activeListings, soldListings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "buyer" }),
      Listing.countDocuments({ status: "available" }),
      Listing.countDocuments({ status: "sold" }),
    ]);

    // Calculate total revenue (sum of all sold listings)
    const revenueResult = await Listing.aggregate([
      { $match: { status: "sold" } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get recent activities
    const recentListings = await Listing.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("farmerId", "name");

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    const recentActivities = [
      ...recentListings.map((listing) => ({
        type: "listing",
        message: `${listing.farmerId?.name || "A farmer"} posted ${listing.quantity} ${listing.unit} of ${listing.cropType}`,
        timestamp: new Date(listing.createdAt).toLocaleString(),
      })),
      ...recentUsers.map((user) => ({
        type: "user",
        message: `${user.name} joined as ${user.role}`,
        timestamp: new Date(user.createdAt).toLocaleString(),
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    // Calculate activity increase (mock calculation - you can implement proper logic)
    const recentActivity = Math.floor(Math.random() * 30) + 10;

    res.json({
      totalUsers,
      farmers,
      buyers,
      activeListings,
      soldListings,
      totalRevenue,
      recentActivity,
      recentActivities,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      data: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        location: user.location,
        profilePicture: user.profilePicture,
        whatsappNumber: user.whatsappNumber,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Delete all listings by this user if they're a farmer
    if (user.role === "farmer") {
      await Listing.deleteMany({ farmerId: id });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // You can add an 'active' field to User model if needed
    // For now, we'll just return success
    res.json({ message: `User status updated to ${active ? "active" : "inactive"}` });
  } catch (error) {
    next(error);
  }
};

export const getAllListingsAdmin = async (_req, res, next) => {
  try {
    const listings = await Listing.find()
      .populate("farmerId", "name phoneNumber location profilePicture")
      .sort({ createdAt: -1 });

    res.json({
      data: listings.map((listing) => ({
        id: listing._id.toString(),
        cropType: listing.cropType,
        quantity: listing.quantity,
        unit: listing.unit,
        price: listing.price,
        location: listing.location,
        status: listing.status,
        images: listing.images,
        createdAt: listing.createdAt,
        farmer: listing.farmerId
          ? {
              id: listing.farmerId._id.toString(),
              name: listing.farmerId.name,
              phoneNumber: listing.farmerId.phoneNumber,
              location: listing.farmerId.location,
              profilePicture: listing.farmerId.profilePicture,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListingAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      const error = new Error("Listing not found");
      error.statusCode = 404;
      throw error;
    }

    await Listing.findByIdAndDelete(id);

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAdminAnalytics = async (_req, res, next) => {
  try {
    // Basic stats
    const [totalUsers, farmers, buyers, totalListings, activeListings, soldListings] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "farmer" }),
        User.countDocuments({ role: "buyer" }),
        Listing.countDocuments(),
        Listing.countDocuments({ status: "available" }),
        Listing.countDocuments({ status: "sold" }),
      ]);

    // Revenue calculation
    const revenueResult = await Listing.aggregate([
      { $match: { status: "sold" } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Crop distribution
    const cropDistribution = await Listing.aggregate([
      { $group: { _id: "$cropType", count: { $sum: 1 } } },
      { $project: { cropType: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    // Top locations
    const topLocations = await Listing.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Average listing price
    const avgPriceResult = await Listing.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$price" } } },
    ]);
    const avgListingPrice = Math.round(avgPriceResult[0]?.avgPrice || 0);

    // Conversion rate
    const conversionRate = totalListings > 0 ? ((soldListings / totalListings) * 100).toFixed(1) : 0;

    // Mock data for some metrics (you can implement proper calculations)
    const revenueGrowth = Math.floor(Math.random() * 20) + 5;
    const newUsersThisWeek = Math.floor(Math.random() * 10) + 1;
    const avgTimeToSell = Math.floor(Math.random() * 10) + 3;
    const engagementRate = Math.floor(Math.random() * 30) + 60;

    res.json({
      totalRevenue,
      revenueGrowth,
      activeUsers: totalUsers,
      newUsersThisWeek,
      totalListings,
      activeListings,
      soldListings,
      conversionRate: parseFloat(conversionRate),
      cropDistribution,
      topLocations,
      avgListingPrice,
      avgTimeToSell,
      engagementRate,
      farmers,
      buyers,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};
