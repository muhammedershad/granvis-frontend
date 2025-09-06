import { useState } from "react";
import { Plus, Users, Phone, Mail, Calendar, Target, TrendingUp, Clock, Star, Search, Filter, MoreVertical, Edit, Trash2, Eye, MessageCircle, CheckCircle, XCircle, AlertCircle, UserPlus, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Enquiry, EnquiryFormData, FollowUp } from "../types/enquiry";

// Mock data for existing clients (this would come from your client management system)
const existingClients = [
  { id: "1", name: "Acme Corporation", email: "contact@acme.com" },
  { id: "2", name: "Tech Solutions Ltd", email: "info@techsolutions.com" },
  { id: "3", name: "Green Valley Developers", email: "hello@greenvalley.com" },
];

// Mock data for team members
const teamMembers = [
  { id: "1", name: "John Smith", role: "Senior Architect" },
  { id: "2", name: "Sarah Johnson", role: "Project Manager" },
  { id: "3", name: "Mike Davis", role: "Design Lead" },
];

// Mock enquiries data
const mockEnquiries: Enquiry[] = [
  {
    id: "1",
    name: "Robert Chen",
    email: "robert@email.com",
    phone: "+1-555-0123",
    careOf: {
      type: "new",
      name: "Chen Enterprises",
      address: "123 Business Park, Downtown"
    },
    projectDetails: "Looking for a modern office complex design with sustainable features. Approximately 50,000 sq ft.",
    customFields: {
      "Project Type": "Commercial Office",
      "Timeline": "6-8 months",
      "Special Requirements": "LEED Certification"
    },
    status: "new",
    priority: "high",
    source: "website",
    estimatedBudget: "$2.5M - $3.5M",
    estimatedTimeline: "6-8 months",
    dateCreated: "2024-01-15",
    lastUpdated: "2024-01-15",
    assignedTo: "John Smith",
    notes: ["Initial contact through website form", "Interested in sustainable design"],
    followUpDate: "2024-01-20"
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    phone: "+1-555-0456",
    careOf: {
      type: "existing",
      clientId: "1",
      clientName: "Acme Corporation"
    },
    projectDetails: "Residential villa project with modern architectural style. Looking for a luxury design with smart home integration.",
    customFields: {
      "Project Type": "Residential Villa",
      "Plot Size": "5000 sq ft"
    },
    status: "follow-up",
    priority: "medium",
    source: "referral",
    estimatedBudget: "$1M - $1.5M",
    dateCreated: "2024-01-10",
    lastUpdated: "2024-01-18",
    assignedTo: "Sarah Johnson",
    notes: ["Referred by existing client", "Second meeting scheduled"],
    followUpDate: "2024-01-22"
  }
];

export function EnquiryPage() {
  const [activeTab, setActiveTab] = useState("new-enquiry");
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    phone: "",
    careOf: { type: "new" },
    projectDetails: "",
    customFields: {},
    priority: "medium",
    source: "website",
    estimatedBudget: "",
    estimatedTimeline: "",
    assignedTo: ""
  });

  const [customFields, setCustomFields] = useState<{ label: string; value: string; }[]>([]);

  const handleSubmit = () => {
    const newEnquiry: Enquiry = {
      id: Date.now().toString(),
      ...formData,
      status: "new",
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: []
    };

    setEnquiries([newEnquiry, ...enquiries]);
    setIsFormOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      careOf: { type: "new" },
      projectDetails: "",
      customFields: {},
      priority: "medium",
      source: "website",
      estimatedBudget: "",
      estimatedTimeline: "",
      assignedTo: ""
    });
    setCustomFields([]);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { label: "", value: "" }]);
  };

  const updateCustomField = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);

    // Update form data
    const newCustomFields = { ...formData.customFields };
    if (updated[index].label && updated[index].value) {
      newCustomFields[updated[index].label] = updated[index].value;
    }
    setFormData({ ...formData, customFields: newCustomFields });
  };

  const removeCustomField = (index: number) => {
    const updated = [...customFields];
    const removedField = updated.splice(index, 1)[0];
    setCustomFields(updated);

    // Remove from form data
    if (removedField.label) {
      const newCustomFields = { ...formData.customFields };
      delete newCustomFields[removedField.label];
      setFormData({ ...formData, customFields: newCustomFields });
    }
  };

  const updateEnquiryStatus = (enquiryId: string, newStatus: Enquiry['status']) => {
    setEnquiries(enquiries.map(enquiry => 
      enquiry.id === enquiryId 
        ? { ...enquiry, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
        : enquiry
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'medium': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'low': return 'bg-gray-500/10 text-gray-600 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'follow-up': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'converted': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'dead-lead': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Star className="h-3 w-3" />;
      case 'follow-up': return <Clock className="h-3 w-3" />;
      case 'converted': return <CheckCircle className="h-3 w-3" />;
      case 'dead-lead': return <XCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.projectDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (enquiry.email && enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const enquiryStats = {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    followUp: enquiries.filter(e => e.status === 'follow-up').length,
    converted: enquiries.filter(e => e.status === 'converted').length,
    deadLead: enquiries.filter(e => e.status === 'dead-lead').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-foreground">Enquiry Management</h1>
              <p className="text-muted-foreground">Transform enquiries into successful projects</p>
            </div>
          </div>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              New Enquiry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-purple-500/[0.02] to-indigo-500/[0.02] dark:from-blue-400/[0.05] dark:via-purple-400/[0.05] dark:to-indigo-400/[0.05] rounded-lg"></div>
            <DialogHeader className="relative">
              <DialogTitle className="text-foreground flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                  <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Create New Enquiry
              </DialogTitle>
              <DialogDescription>
                Capture comprehensive client enquiry details and project requirements to build your pipeline
              </DialogDescription>
            </DialogHeader>

            <div className="relative space-y-8 py-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-foreground">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-foreground">Client Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter client name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-foreground">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="source" className="text-foreground">Source</Label>
                    <Select value={formData.source} onValueChange={(value: any) => setFormData({ ...formData, source: value })}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="advertisement">Advertisement</SelectItem>
                        <SelectItem value="walk-in">Walk-in</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Care Of Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                    <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-foreground">Care Of Details</h3>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-foreground">Contact Type</Label>
                  <RadioGroup
                    value={formData.careOf.type}
                    onValueChange={(value: 'existing' | 'new') => 
                      setFormData({ ...formData, careOf: { type: value } })
                    }
                    className="flex gap-8"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="existing" id="existing" />
                      <Label htmlFor="existing" className="text-foreground">Existing Client</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new" className="text-foreground">New Contact</Label>
                    </div>
                  </RadioGroup>

                  {formData.careOf.type === 'existing' ? (
                    <div className="space-y-3">
                      <Label className="text-foreground">Select Client</Label>
                      <Select 
                        value={formData.careOf.clientId} 
                        onValueChange={(value) => {
                          const client = existingClients.find(c => c.id === value);
                          setFormData({ 
                            ...formData, 
                            careOf: { 
                              type: 'existing', 
                              clientId: value, 
                              clientName: client?.name 
                            } 
                          });
                        }}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select existing client" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingClients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{client.name}</span>
                                <span className="text-sm text-muted-foreground">{client.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="careOfName" className="text-foreground">Contact Name</Label>
                        <Input
                          id="careOfName"
                          placeholder="Enter contact name"
                          value={formData.careOf.name || ""}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            careOf: { ...formData.careOf, name: e.target.value } 
                          })}
                          className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="careOfAddress" className="text-foreground">Address</Label>
                        <Input
                          id="careOfAddress"
                          placeholder="Enter address"
                          value={formData.careOf.address || ""}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            careOf: { ...formData.careOf, address: e.target.value } 
                          })}
                          className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                    <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-foreground">Project Information</h3>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="projectDetails" className="text-foreground">Project Details *</Label>
                  <Textarea
                    id="projectDetails"
                    placeholder="Describe the project requirements, scope, timeline, and any specific needs or preferences..."
                    className="min-h-[140px] bg-background/50 border-border/50 focus:bg-background transition-colors resize-none"
                    value={formData.projectDetails}
                    onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $100K - $200K"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Estimated Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., 3-6 months"
                    value={formData.estimatedTimeline}
                    onChange={(e) => setFormData({ ...formData, estimatedTimeline: e.target.value })}
                  />
                </div>
              </div>

              {/* Assign To */}
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Custom Fields</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomField}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>
                
                {customFields.map((field, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Field Name</Label>
                      <Input
                        placeholder="e.g., Project Type"
                        value={field.label}
                        onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Value</Label>
                      <Input
                        placeholder="e.g., Residential"
                        value={field.value}
                        onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="relative pt-6 border-t border-border/50">
              <Button 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
                className="border-border/50 hover:bg-muted/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone || !formData.projectDetails}
                className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create Enquiry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-blue-600/5 dark:from-blue-400/10 dark:via-indigo-400/10 dark:to-blue-500/10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Enquiries</p>
                <h3 className="text-foreground">{enquiryStats.total}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-200/50 dark:border-blue-800/50 group-hover:scale-105 transition-transform duration-300">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 dark:from-emerald-400/10 dark:via-green-400/10 dark:to-emerald-500/10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">New Enquiries</p>
                <h3 className="text-foreground">{enquiryStats.new}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 group-hover:scale-105 transition-transform duration-300">
                <Star className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5 dark:from-amber-400/10 dark:via-yellow-400/10 dark:to-orange-400/10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Follow-ups</p>
                <h3 className="text-foreground">{enquiryStats.followUp}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-200/50 dark:border-amber-800/50 group-hover:scale-105 transition-transform duration-300">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-violet-500/5 to-purple-600/5 dark:from-purple-400/10 dark:via-violet-400/10 dark:to-purple-500/10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Converted</p>
                <h3 className="text-foreground">{enquiryStats.converted}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-200/50 dark:border-purple-800/50 group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-red-600/5 dark:from-red-400/10 dark:via-rose-400/10 dark:to-red-500/10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Dead Leads</p>
                <h3 className="text-foreground">{enquiryStats.deadLead}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-xl border border-red-200/50 dark:border-red-800/50 group-hover:scale-105 transition-transform duration-300">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enquiry Management */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-purple-500/[0.02] to-indigo-500/[0.02] dark:from-blue-400/[0.05] dark:via-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
        <CardHeader className="relative pb-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-foreground">Enquiry Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Track and manage all client enquiries</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search enquiries by name, project, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New Enquiries</SelectItem>
                <SelectItem value="follow-up">Follow-ups</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="dead-lead">Dead Leads</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="relative p-0">
          <div className="space-y-4 p-6">
            {filteredEnquiries.map((enquiry, index) => (
              <Card key={enquiry.id} className="relative overflow-hidden bg-card/30 hover:bg-card/50 border-border/30 hover:border-border/60 transition-all duration-300 group hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.01] to-purple-500/[0.01] group-hover:from-blue-500/[0.02] group-hover:to-purple-500/[0.02] transition-all duration-300"></div>
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Header with name and badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-foreground truncate">{enquiry.name}</h4>
                            <Badge variant="outline" className={`${getPriorityColor(enquiry.priority)} text-xs`}>
                              {enquiry.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={`${getStatusColor(enquiry.status)} text-xs`}>
                              {getStatusIcon(enquiry.status)}
                              <span className="ml-1 capitalize">{enquiry.status.replace('-', ' ')}</span>
                            </Badge>
                          </div>
                          
                          {/* Contact Information */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-blue-500/10 rounded">
                                <Phone className="h-3 w-3 text-blue-600" />
                              </div>
                              {enquiry.phone}
                            </div>
                            {enquiry.email && (
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-purple-500/10 rounded">
                                  <Mail className="h-3 w-3 text-purple-600" />
                                </div>
                                {enquiry.email}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-green-500/10 rounded">
                                <Calendar className="h-3 w-3 text-green-600" />
                              </div>
                              {enquiry.dateCreated}
                            </div>
                          </div>
                        </div>
                        
                        {/* Budget and Timeline */}
                        <div className="text-right space-y-1">
                          {enquiry.estimatedBudget && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Budget: </span>
                              <span className="text-emerald-600 dark:text-emerald-400">{enquiry.estimatedBudget}</span>
                            </div>
                          )}
                          {enquiry.estimatedTimeline && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Timeline: </span>
                              <span className="text-foreground">{enquiry.estimatedTimeline}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Project Details */}
                      <div className="space-y-3">
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                          {enquiry.projectDetails}
                        </p>
                        
                        {/* Care of Information */}
                        <div className="text-sm">
                          {enquiry.careOf.type === 'existing' ? (
                            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <Users className="h-3 w-3" />
                              Care of: {enquiry.careOf.clientName}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Care of: {enquiry.careOf.name} - {enquiry.careOf.address}
                            </span>
                          )}
                        </div>
                        
                        {/* Assignment */}
                        {enquiry.assignedTo && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Assigned to: </span>
                            <span className="text-purple-600 dark:text-purple-400">{enquiry.assignedTo}</span>
                          </div>
                        )}
                        
                        {/* Custom Fields */}
                        {Object.keys(enquiry.customFields).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(enquiry.customFields).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-xs bg-muted/50">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {enquiry.status === 'new' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateEnquiryStatus(enquiry.id, 'follow-up')}
                              className="text-blue-600 border-blue-200/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                            >
                              <MessageCircle className="mr-2 h-3 w-3" />
                              Follow Up
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateEnquiryStatus(enquiry.id, 'converted')}
                              className="text-emerald-600 border-emerald-200/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            >
                              <CheckCircle className="mr-2 h-3 w-3" />
                              Convert to Client
                            </Button>
                          </>
                        )}
                        
                        {enquiry.status === 'follow-up' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateEnquiryStatus(enquiry.id, 'converted')}
                              className="text-emerald-600 border-emerald-200/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            >
                              <CheckCircle className="mr-2 h-3 w-3" />
                              Convert to Client
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateEnquiryStatus(enquiry.id, 'dead-lead')}
                              className="text-red-600 border-red-200/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <XCircle className="mr-2 h-3 w-3" />
                              Mark as Dead Lead
                            </Button>
                          </>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="ml-auto">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedEnquiry(enquiry)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Enquiry
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredEnquiries.length === 0 && (
            <div className="text-center py-16">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 inline-block mb-6">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-foreground mb-2">No enquiries found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find enquiries'
                  : 'Start building your client pipeline by creating your first enquiry'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create First Enquiry
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Enquiry Details - {selectedEnquiry.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-foreground">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-foreground">{selectedEnquiry.phone}</p>
                </div>
                {selectedEnquiry.email && (
                  <div>
                    <Label>Email</Label>
                    <p className="text-foreground">{selectedEnquiry.email}</p>
                  </div>
                )}
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedEnquiry.status)}>
                    {getStatusIcon(selectedEnquiry.status)}
                    <span className="ml-1 capitalize">{selectedEnquiry.status.replace('-', ' ')}</span>
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Care Of</Label>
                <p className="text-foreground">
                  {selectedEnquiry.careOf.type === 'existing' 
                    ? selectedEnquiry.careOf.clientName 
                    : `${selectedEnquiry.careOf.name} - ${selectedEnquiry.careOf.address}`
                  }
                </p>
              </div>
              
              <div>
                <Label>Project Details</Label>
                <p className="text-foreground whitespace-pre-wrap">{selectedEnquiry.projectDetails}</p>
              </div>
              
              {Object.keys(selectedEnquiry.customFields).length > 0 && (
                <div>
                  <Label>Custom Fields</Label>
                  <div className="space-y-2">
                    {Object.entries(selectedEnquiry.customFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date Created</Label>
                  <p className="text-foreground">{selectedEnquiry.dateCreated}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-foreground">{selectedEnquiry.lastUpdated}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}