import { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Building2,
  Users,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Grid3X3,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AddClientForm } from "./AddClientForm";
import { Client, ClientFilters, ClientSort, ClientViewType } from "../types/client";
import { cn } from "./ui/utils";

// Mock client data
const mockClients: Client[] = [
  {
    id: "1",
    name: "John Williams",
    email: "john.williams@luxuryhomes.com",
    phone: "+1 (555) 123-4567",
    website: "https://luxuryhomes.com",
    companyName: "Luxury Homes LLC",
    companyType: "Small Business",
    industry: "Real Estate",
    address: {
      street: "123 Beverly Hills Drive",
      city: "Beverly Hills",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    primaryContact: {
      name: "John Williams",
      title: "CEO",
      email: "john.williams@luxuryhomes.com",
      phone: "+1 (555) 123-4567"
    },
    status: "Active",
    source: "Website",
    priority: "High",
    totalProjectValue: 850000,
    projectsCount: 1,
    notes: "High-value client interested in luxury residential projects. Excellent communication and prompt payments.",
    tags: ["Luxury", "Residential", "High-Value"],
    projectIds: ["1"],
    activeProjects: 1,
    completedProjects: 0,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
    createdBy: "John Doe",
    lastContactDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "s.chen@metrodev.com",
    phone: "+1 (555) 234-5678",
    website: "https://metrodev.com",
    companyName: "Metro Development Corp",
    companyType: "Corporation",
    industry: "Real Estate Development",
    address: {
      street: "456 Manhattan Plaza",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    primaryContact: {
      name: "Sarah Chen",
      title: "Project Director",
      email: "s.chen@metrodev.com",
      phone: "+1 (555) 234-5678"
    },
    secondaryContact: {
      name: "Michael Park",
      title: "Development Manager",
      email: "m.park@metrodev.com",
      phone: "+1 (555) 234-5679"
    },
    status: "Active",
    source: "Referral",
    priority: "VIP",
    totalProjectValue: 15000000,
    projectsCount: 1,
    notes: "Major commercial development company. Long-term partnership potential with multiple upcoming projects.",
    tags: ["Commercial", "High-Volume", "Corporate"],
    projectIds: ["2"],
    activeProjects: 1,
    completedProjects: 0,
    createdAt: "2024-02-20",
    updatedAt: "2024-02-25",
    createdBy: "Emily Rodriguez",
    lastContactDate: "2024-02-22"
  },
  {
    id: "3",
    name: "Amanda Foster",
    email: "amanda@luxuryhotels.com",
    phone: "+1 (555) 345-6789",
    website: "https://luxuryhospitality.com",
    companyName: "Luxury Hospitality Group",
    companyType: "Corporation",
    industry: "Hospitality",
    address: {
      street: "789 Ocean Drive",
      city: "Miami",
      state: "FL",
      zipCode: "33139",
      country: "USA"
    },
    primaryContact: {
      name: "Amanda Foster",
      title: "VP of Development",
      email: "amanda@luxuryhotels.com",
      phone: "+1 (555) 345-6789"
    },
    status: "Active",
    source: "Advertisement",
    priority: "Medium",
    totalProjectValue: 2500000,
    projectsCount: 1,
    notes: "Completed boutique hotel project successfully. Interested in future hospitality projects.",
    tags: ["Hospitality", "Interior", "Repeat Client"],
    projectIds: ["3"],
    activeProjects: 0,
    completedProjects: 1,
    createdAt: "2023-05-15",
    updatedAt: "2023-12-20",
    createdBy: "Sarah Johnson",
    lastContactDate: "2023-12-18"
  },
  {
    id: "4",
    name: "Dr. Robert Martinez",
    email: "r.martinez@stateuniv.edu",
    phone: "+1 (555) 456-7890",
    website: "https://stateuniv.edu",
    companyName: "State University",
    companyType: "Government",
    industry: "Education",
    address: {
      street: "1000 University Avenue",
      city: "Austin",
      state: "TX",
      zipCode: "78712",
      country: "USA"
    },
    primaryContact: {
      name: "Dr. Robert Martinez",
      title: "Facilities Director",
      email: "r.martinez@stateuniv.edu",
      phone: "+1 (555) 456-7890"
    },
    status: "Active",
    source: "Referral",
    priority: "Low",
    totalProjectValue: 5500000,
    projectsCount: 1,
    notes: "Government contract for campus landscape development. Requires detailed compliance documentation.",
    tags: ["Government", "Education", "Landscape"],
    projectIds: ["4"],
    activeProjects: 1,
    completedProjects: 0,
    createdAt: "2024-03-15",
    updatedAt: "2024-03-20",
    createdBy: "Michael Chen",
    lastContactDate: "2024-03-18"
  },
  {
    id: "5",
    name: "Jennifer Thompson",
    email: "j.thompson@greenliving.com",
    phone: "+1 (555) 567-8901",
    website: "https://greenlivingcommunities.com",
    companyName: "Green Living Communities",
    companyType: "Small Business",
    industry: "Sustainable Development",
    address: {
      street: "555 Green Valley Road",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA"
    },
    primaryContact: {
      name: "Jennifer Thompson",
      title: "Founder & CEO",
      email: "j.thompson@greenliving.com",
      phone: "+1 (555) 567-8901"
    },
    status: "Active",
    source: "Social Media",
    priority: "Medium",
    totalProjectValue: 3200000,
    projectsCount: 1,
    notes: "Passionate about sustainable development. Focus on eco-friendly materials and energy-efficient designs.",
    tags: ["Sustainable", "Eco-Friendly", "Residential"],
    projectIds: ["5"],
    activeProjects: 1,
    completedProjects: 0,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
    createdBy: "Lisa Thompson",
    lastContactDate: "2024-01-23"
  },
  {
    id: "6",
    name: "David Kim",
    email: "david.kim@techstartup.com",
    phone: "+1 (555) 678-9012",
    website: "https://techstartup.com",
    companyName: "Innovation Tech Hub",
    companyType: "Small Business",
    industry: "Technology",
    address: {
      street: "123 Silicon Valley Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA"
    },
    primaryContact: {
      name: "David Kim",
      title: "CTO",
      email: "david.kim@techstartup.com",
      phone: "+1 (555) 678-9012"
    },
    status: "Potential",
    source: "Cold Call",
    priority: "Medium",
    totalProjectValue: 0,
    projectsCount: 0,
    notes: "Interested in modern office space design. Currently evaluating multiple architectural firms.",
    tags: ["Technology", "Office", "Modern"],
    projectIds: [],
    activeProjects: 0,
    completedProjects: 0,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
    createdBy: "John Doe",
    lastContactDate: "2024-02-03"
  }
];

const ITEMS_PER_PAGE = 8;

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<ClientViewType>("cards");
  const [filters, setFilters] = useState<ClientFilters>({
    search: "",
    companyType: "all",
    status: "all",
    priority: "all",
    industry: "all",
    source: "all"
  });
  const [sort, setSort] = useState<ClientSort>({
    field: "name",
    direction: "asc"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get unique values for filter options
  const companyTypes = [...new Set(clients.map(client => client.companyType))];
  const statuses = [...new Set(clients.map(client => client.status))];
  const priorities = [...new Set(clients.map(client => client.priority))];
  const industries = [...new Set(clients.map(client => client.industry))];
  const sources = [...new Set(clients.map(client => client.source))];

  // Calculate statistics
  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.status === "Active").length;
    const potential = clients.filter(c => c.status === "Potential").length;
    const vip = clients.filter(c => c.priority === "VIP").length;
    const totalValue = clients.reduce((sum, c) => sum + c.totalProjectValue, 0);
    const avgValue = total > 0 ? Math.round(totalValue / total) : 0;
    const totalProjects = clients.reduce((sum, c) => sum + c.projectsCount, 0);

    return { total, active, potential, vip, totalValue, avgValue, totalProjects };
  }, [clients]);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        client.name.toLowerCase().includes(searchTerm) ||
        client.companyName.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.industry.toLowerCase().includes(searchTerm);

      const matchesCompanyType = filters.companyType === "all" || client.companyType === filters.companyType;
      const matchesStatus = filters.status === "all" || client.status === filters.status;
      const matchesPriority = filters.priority === "all" || client.priority === filters.priority;
      const matchesIndustry = filters.industry === "all" || client.industry === filters.industry;
      const matchesSource = filters.source === "all" || client.source === filters.source;

      return matchesSearch && matchesCompanyType && matchesStatus && matchesPriority && matchesIndustry && matchesSource;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, filters, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredAndSortedClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Potential": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Inactive": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "Former": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-3 h-3" />;
      case "Potential": return <Clock className="w-3 h-3" />;
      case "Inactive": return <AlertCircle className="w-3 h-3" />;
      case "Former": return <AlertCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-gray-500/20 text-gray-400";
      case "Medium": return "bg-blue-500/20 text-blue-400";
      case "High": return "bg-orange-500/20 text-orange-400";
      case "VIP": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "VIP": return <Star className="w-3 h-3" />;
      case "High": return <TrendingUp className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleSort = (field: keyof Client) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (field: keyof Client) => {
    if (sort.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sort.direction === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleAddClient = (newClient: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    const client: Client = {
      ...newClient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClients(prev => [...prev, client]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-white/90">Client Management</h1>
          <p className="text-white/60">Manage your clients and their project relationships</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <Button
              variant={viewType === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("cards")}
              className={cn(
                "px-3",
                viewType === "cards" 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                  : "text-white/70 hover:text-white"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("table")}
              className={cn(
                "px-3",
                viewType === "table" 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                  : "text-white/70 hover:text-white"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white/90">Add New Client</DialogTitle>
              </DialogHeader>
              <AddClientForm onSubmit={handleAddClient} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Clients</p>
              <p className="text-white/90 text-2xl">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Active Clients</p>
              <p className="text-white/90 text-2xl">{stats.active}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">VIP Clients</p>
              <p className="text-white/90 text-2xl">{stats.vip}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Potential</p>
              <p className="text-white/90 text-2xl">{stats.potential}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Value</p>
              <p className="text-white/90 text-xl">${(stats.totalValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Avg Value</p>
              <p className="text-white/90 text-xl">${(stats.avgValue / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/20 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-3 bg-pink-500/20 rounded-xl border border-pink-500/30">
              <Briefcase className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Projects</p>
              <p className="text-white/90 text-2xl">{stats.totalProjects}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-black/20 border-white/10 backdrop-blur-xl">
        <div className="space-y-4">
          <h3 className="text-white/90 text-lg">Search & Filter Clients</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setFilters({ search: "", companyType: "all", status: "all", priority: "all", industry: "all", source: "all" })}
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          
          {filteredAndSortedClients.length !== clients.length && (
            <div className="text-white/60 text-sm">
              Showing {filteredAndSortedClients.length} of {clients.length} clients
            </div>
          )}
        </div>
      </Card>

      {/* Clients Display */}
      {viewType === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedClients.map((client) => (
            <Card key={client.id} className="bg-black/20 border-white/10 backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 border-2 border-white/10">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white/90 text-base">{client.name}</CardTitle>
                      <p className="text-white/60 text-sm">{client.companyName}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <Badge className={cn("flex items-center space-x-1", getStatusColor(client.status))}>
                    {getStatusIcon(client.status)}
                    <span>{client.status}</span>
                  </Badge>
                  <Badge className={cn("flex items-center space-x-1", getPriorityColor(client.priority))}>
                    {getPriorityIcon(client.priority)}
                    <span>{client.priority}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Building2 className="w-4 h-4 text-white/40" />
                    <span className="text-white/70">{client.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-white/40" />
                    <span className="text-white/70 truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-white/40" />
                    <span className="text-white/70">{client.phone}</span>
                  </div>
                  {client.website && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-4 h-4 text-white/40" />
                      <a 
                        href={client.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 truncate flex items-center space-x-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-white/10">
                  <div>
                    <p className="text-white/60">Project Value</p>
                    <p className="text-white/90">${(client.totalProjectValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-white/60">Projects</p>
                    <p className="text-white/90">{client.projectsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 text-white/70 hover:text-white"
                    >
                      Client {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-white/70">Company</TableHead>
                  <TableHead className="text-white/70">Contact</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Priority</TableHead>
                  <TableHead className="text-white/70">Projects</TableHead>
                  <TableHead className="text-white/70">Value</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 border-2 border-white/10">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white/90">{client.name}</p>
                          <p className="text-white/50 text-sm">{client.primaryContact.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white/80">{client.companyName}</p>
                        <p className="text-white/50 text-sm">{client.industry}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-white/40" />
                          <span className="text-white/70 text-sm">{client.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-white/40" />
                          <span className="text-white/70 text-sm">{client.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("flex items-center space-x-1 w-fit", getStatusColor(client.status))}>
                        {getStatusIcon(client.status)}
                        <span>{client.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("flex items-center space-x-1 w-fit", getPriorityColor(client.priority))}>
                        {getPriorityIcon(client.priority)}
                        <span>{client.priority}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-white/70">
                        <p>{client.projectsCount} total</p>
                        <p className="text-sm text-white/50">
                          {client.activeProjects} active, {client.completedProjects} done
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">
                      ${(client.totalProjectValue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-400"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <div className="text-white/60 text-sm">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedClients.length)} of {filteredAndSortedClients.length} clients
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="text-white/70 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}