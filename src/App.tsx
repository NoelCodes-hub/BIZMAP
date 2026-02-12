import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import Tools from "./pages/Tools";
import Chat from "./pages/Chat";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import DistanceCalculator from "./pages/tools/DistanceCalculator";
import AreaMeasurement from "./pages/tools/AreaMeasurement";
import BatchGeocoding from "./pages/tools/BatchGeocoding";
import RouteOptimizer from "./pages/tools/RouteOptimizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="map" element={<MapPage />} />
              <Route path="knowledge" element={<KnowledgeBase />} />
              <Route path="tools" element={<Tools />} />
              <Route path="tools/distance" element={<DistanceCalculator />} />
              <Route path="tools/area" element={<AreaMeasurement />} />
              <Route path="tools/geocoding" element={<BatchGeocoding />} />
              <Route path="tools/route-optimizer" element={<RouteOptimizer />} />
              <Route path="chat" element={<Chat />} />
              <Route path="products" element={<Products />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
