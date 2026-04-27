import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, TrendingUp, TrendingDown, Minus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchMarketPrices } from "@/services/marketApi";
import { updateMarketPrices } from "@/services/adminApi";
import { sessionStore } from "@/lib/session";
import { toast } from "@/hooks/use-toast";
import type { ApiMarketPrice } from "@/types/api";

const AdminPrices = () => {
  const token = sessionStore.getToken();
  const queryClient = useQueryClient();
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});

  const { data: prices, isLoading } = useQuery({
    queryKey: ["marketPrices"],
    queryFn: fetchMarketPrices,
  });

  const updateMutation = useMutation({
    mutationFn: (priceUpdates: Array<{ cropType: string; currentPrice: number }>) =>
      updateMarketPrices(token, priceUpdates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketPrices"] });
      setEditedPrices({});
      toast({ title: "Market prices updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="size-5 text-success" />;
      case "down":
        return <TrendingDown className="size-5 text-destructive" />;
      default:
        return <Minus className="size-5 text-muted-foreground" />;
    }
  };

  const handlePriceChange = (cropType: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditedPrices((prev) => ({ ...prev, [cropType]: numValue }));
    }
  };

  const handleSave = () => {
    const updates = Object.entries(editedPrices).map(([cropType, currentPrice]) => ({
      cropType,
      currentPrice,
    }));

    if (updates.length === 0) {
      toast({ title: "No changes to save", variant: "destructive" });
      return;
    }

    updateMutation.mutate(updates);
  };

  const hasChanges = Object.keys(editedPrices).length > 0;

  if (isLoading) {
    return (
      <div className="animate-gentle-rise space-y-4">
        <div className="h-32 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-gentle-rise space-y-6">
      {/* Header */}
      <Card className="rounded-3xl border-2 shadow-touch">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-12 place-items-center rounded-2xl bg-accent text-2xl text-accent-foreground">
                💰
              </div>
              <div>
                <CardTitle className="text-2xl">Market Prices Management</CardTitle>
                <CardDescription className="font-semibold">
                  Update current market prices for crops
                </CardDescription>
              </div>
            </div>
            {hasChanges && (
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="rounded-2xl font-bold"
                size="lg"
              >
                <Save className="mr-2 size-5" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Price Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {prices?.data?.map((price: ApiMarketPrice) => {
          const currentEditedPrice = editedPrices[price.cropType];
          const displayPrice = currentEditedPrice ?? price.currentPrice;
          const hasEdit = currentEditedPrice !== undefined;

          return (
            <Card
              key={price.cropType}
              className={`rounded-3xl border-2 shadow-touch transition-all ${
                hasEdit ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-16 place-items-center rounded-3xl bg-surface-leaf text-4xl shadow-touch">
                      {getCropEmoji(price.cropType)}
                    </div>
                    <div>
                      <CardTitle className="text-xl capitalize">{price.cropType}</CardTitle>
                      <CardDescription className="font-semibold">{price.location}</CardDescription>
                    </div>
                  </div>
                  {getTrendIcon(price.trend)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Price Display */}
                <div className="rounded-2xl border-2 bg-surface-warm p-4">
                  <p className="text-sm font-bold text-muted-foreground">Current Price</p>
                  <p className="text-4xl font-black text-primary">₵{price.currentPrice.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-muted-foreground">per {price.unit}</p>
                </div>

                {/* Price Change Indicator */}
                {price.previousPrice > 0 && (
                  <div className="flex items-center justify-between rounded-2xl border bg-card p-3">
                    <span className="text-sm font-bold text-muted-foreground">Previous Price</span>
                    <div className="text-right">
                      <p className="font-bold">₵{price.previousPrice.toLocaleString()}</p>
                      <p
                        className={`text-xs font-bold ${
                          price.change > 0
                            ? "text-success"
                            : price.change < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }`}
                      >
                        {price.change > 0 ? "+" : ""}
                        {price.change.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Edit Price Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Update Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-black text-muted-foreground">
                      ₵
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={displayPrice}
                      onChange={(e) => handlePriceChange(price.cropType, e.target.value)}
                      className="rounded-2xl pl-8 text-lg font-bold"
                      placeholder="Enter new price"
                    />
                  </div>
                  {hasEdit && (
                    <p className="text-xs font-semibold text-primary">
                      Change: ₵{(displayPrice - price.currentPrice).toFixed(2)} (
                      {(((displayPrice - price.currentPrice) / price.currentPrice) * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>

                {/* Last Updated */}
                <div className="rounded-xl bg-muted p-2 text-center">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Last updated: {new Date(price.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="rounded-3xl border-2 border-accent/30 bg-accent/5 shadow-touch">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-accent/20 text-xl">ℹ️</div>
            <div className="flex-1">
              <h3 className="font-black text-foreground">Price Update Guidelines</h3>
              <ul className="mt-2 space-y-1 text-sm font-semibold text-muted-foreground">
                <li>• Prices are displayed per {prices?.data?.[0]?.unit || "unit"}</li>
                <li>• Previous prices are automatically saved when you update</li>
                <li>• Price trends are calculated based on the change percentage</li>
                <li>• All farmers and buyers will see the updated prices immediately</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrices;
