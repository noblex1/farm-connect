import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { FarmShell } from "./components/FarmShell.tsx";
import BuyerMarketplace from "./pages/BuyerMarketplace.tsx";
import FarmerDashboard from "./pages/FarmerDashboard.tsx";
import FarmerCreateAccount from "./pages/FarmerCreateAccount.tsx";
import FarmerLogin from "./pages/FarmerLogin.tsx";
import Index from "./pages/Index.tsx";
import Landing from "./pages/Landing.tsx";
import MarketPrices from "./pages/MarketPrices.tsx";
import MyListings from "./pages/MyListings.tsx";
import NotFound from "./pages/NotFound.tsx";
import PostProduce from "./pages/PostProduce.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import DiagnosticProfile from "./pages/DiagnosticProfile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<FarmShell />}>
            <Route index element={<Index />} />
            <Route path="home" element={<Landing />} />
            <Route path="login" element={<FarmerLogin />} />
            <Route path="create-account" element={<FarmerCreateAccount />} />
            <Route path="diagnostic" element={<DiagnosticProfile />} />
            
            {/* Buyer Routes */}
            <Route element={<RequireAuth allowedRoles={["buyer"]} />}>
              <Route path="buyer" element={<BuyerMarketplace />} />
              <Route path="marketplace" element={<BuyerMarketplace />} />
            </Route>
            
            {/* Farmer Routes */}
            <Route element={<RequireAuth allowedRoles={["farmer"]} />}>
              <Route path="farmer" element={<FarmerDashboard />} />
              <Route path="farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="farmer/listings" element={<MyListings />} />
              <Route path="post" element={<PostProduce />} />
              <Route path="listings" element={<MyListings />} />
            </Route>
            
            {/* Shared Routes */}
            <Route element={<RequireAuth allowedRoles={["farmer", "buyer", "admin"]} />}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="prices" element={<MarketPrices />} />
            </Route>
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
