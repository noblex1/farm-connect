import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Search, Filter, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllListings, deleteListingAdmin } from "@/services/adminApi";
import { sessionStore } from "@/lib/session";
import { toast } from "@/hooks/use-toast";
import type { ApiListing } from "@/types/api";

const AdminListings = () => {
  const token = sessionStore.getToken();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: listings, isLoading } = useQuery({
    queryKey: ["adminListings"],
    queryFn: () => fetchAllListings(token),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (listingId: string) => deleteListingAdmin(token, listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      toast({ title: "Listing deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredListings = listings?.data?.filter((listing: ApiListing) => {
    const matchesSearch =
      listing.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.farmer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = cropFilter === "all" || listing.cropType === cropFilter;
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesCrop && matchesStatus;
  });

  const getCropEmoji = (crop: string) => {
    switch (crop) {
      case "maize":
        return "🌽";
      case "rice":
        return "🌾";
      case "yam":
        return "🍠";
      default:
        return "🌱";
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "available" ? (
      <Badge className="rounded-xl bg-success font-bold text-white">
        <CheckCircle className="mr-1 size-3" />
        Available
      </Badge>
    ) : (
      <Badge className="rounded-xl bg-muted font-bold text-muted-foreground">
        <XCircle className="mr-1 size-3" />
        Sold
      </Badge>
    );
  };

  const handleDelete = (listingId: string, cropType: string) => {
    if (window.confirm(`Are you sure you want to delete this ${cropType} listing?`)) {
      deleteMutation.mutate(listingId);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-gentle-rise space-y-4">
        <div className="h-32 animate-pulse rounded-3xl bg-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="animate-gentle-rise space-y-6">
      {/* Header */}
      <Card className="rounded-3xl border-2 shadow-touch">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-2xl text-secondary-foreground">
              📦
            </div>
            Listings Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border bg-surface-leaf p-4">
              <p className="text-sm font-bold text-muted-foreground">Total Listings</p>
              <p className="text-3xl font-black">{listings?.data?.length || 0}</p>
            </div>
            <div className="rounded-2xl border bg-green-50 p-4">
              <p className="text-sm font-bold text-muted-foreground">Available</p>
              <p className="text-3xl font-black text-success">
                {listings?.data?.filter((l: ApiListing) => l.status === "available").length || 0}
              </p>
            </div>
            <div className="rounded-2xl border bg-surface-warm p-4">
              <p className="text-sm font-bold text-muted-foreground">Sold</p>
              <p className="text-3xl font-black text-secondary">
                {listings?.data?.filter((l: ApiListing) => l.status === "sold").length || 0}
              </p>
            </div>
            <div className="rounded-2xl border bg-yellow-50 p-4">
              <p className="text-sm font-bold text-muted-foreground">Total Value</p>
              <p className="text-3xl font-black text-accent">
                ₵
                {listings?.data
                  ?.reduce((sum: number, l: ApiListing) => sum + l.price * l.quantity, 0)
                  .toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by crop, location, or farmer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl pl-10 font-semibold"
              />
            </div>
            <Select value={cropFilter} onValueChange={setCropFilter}>
              <SelectTrigger className="w-full rounded-2xl font-semibold sm:w-40">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="maize">🌽 Maize</SelectItem>
                <SelectItem value="rice">🌾 Rice</SelectItem>
                <SelectItem value="yam">🍠 Yam</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-2xl font-semibold sm:w-40">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card className="rounded-3xl border-2 shadow-touch">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2">
                  <TableHead className="font-black">Produce</TableHead>
                  <TableHead className="font-black">Farmer</TableHead>
                  <TableHead className="font-black">Quantity</TableHead>
                  <TableHead className="font-black">Price</TableHead>
                  <TableHead className="font-black">Location</TableHead>
                  <TableHead className="font-black">Status</TableHead>
                  <TableHead className="font-black">Posted</TableHead>
                  <TableHead className="text-right font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings?.map((listing: ApiListing) => (
                  <TableRow key={listing.id} className="border-b">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-12 place-items-center rounded-2xl bg-surface-leaf text-2xl">
                          {getCropEmoji(listing.cropType)}
                        </div>
                        <div>
                          <p className="font-bold capitalize">{listing.cropType}</p>
                          {listing.images.length > 0 && (
                            <p className="text-xs text-muted-foreground">{listing.images.length} images</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {listing.farmer?.profilePicture ? (
                          <img
                            src={listing.farmer.profilePicture}
                            alt={listing.farmer.name}
                            className="size-8 rounded-full border object-cover"
                          />
                        ) : (
                          <div className="grid size-8 place-items-center rounded-full bg-primary/10">👤</div>
                        )}
                        <div>
                          <p className="font-bold text-sm">{listing.farmer?.name}</p>
                          <p className="text-xs text-muted-foreground">{listing.farmer?.phoneNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">
                        {listing.quantity} {listing.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">₵{listing.price.toLocaleString()}</span>
                      <p className="text-xs text-muted-foreground">per {listing.unit}</p>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{listing.location}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(listing.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleDelete(listing.id, listing.cropType)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredListings?.length === 0 && (
            <div className="py-12 text-center">
              <Package className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-2 font-bold text-muted-foreground">No listings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminListings;
