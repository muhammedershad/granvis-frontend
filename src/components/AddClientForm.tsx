import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Client } from "../types/client";

interface AddClientFormProps {
  onSubmit: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function AddClientForm({ onSubmit, onCancel }: AddClientFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    website: "",
    
    // Company Information
    companyName: "",
    companyType: "Small Business" as const,
    industry: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    
    // Primary Contact
    primaryContactName: "",
    primaryContactTitle: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    
    // Secondary Contact
    secondaryContactName: "",
    secondaryContactTitle: "",
    secondaryContactEmail: "",
    secondaryContactPhone: "",
    
    // Business Information
    status: "Potential" as const,
    source: "Website" as const,
    priority: "Medium" as const,
    
    // Notes and Tags
    notes: "",
    tags: "",
    
    // System
    createdBy: "Current User"
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const client: Omit<Client, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || undefined,
      companyName: formData.companyName,
      companyType: formData.companyType,
      industry: formData.industry,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      primaryContact: {
        name: formData.primaryContactName || formData.name,
        title: formData.primaryContactTitle,
        email: formData.primaryContactEmail || formData.email,
        phone: formData.primaryContactPhone || formData.phone
      },
      secondaryContact: formData.secondaryContactName ? {
        name: formData.secondaryContactName,
        title: formData.secondaryContactTitle,
        email: formData.secondaryContactEmail,
        phone: formData.secondaryContactPhone
      } : undefined,
      status: formData.status,
      source: formData.source,
      priority: formData.priority,
      totalProjectValue: 0,
      projectsCount: 0,
      notes: formData.notes,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      projectIds: [],
      activeProjects: 0,
      completedProjects: 0,
      createdBy: formData.createdBy
    };

    onSubmit(client);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70">Contact Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                placeholder="John Smith"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                placeholder="john@company.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/70">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                required
                placeholder="+1 (555) 123-4567"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="text-white/70">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange("website")}
                placeholder="https://company.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white/70">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={handleInputChange("companyName")}
                required
                placeholder="ABC Company Inc."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-white/70">Industry *</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={handleInputChange("industry")}
                required
                placeholder="Real Estate"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyType" className="text-white/70">Company Type</Label>
              <Select value={formData.companyType} onValueChange={handleSelectChange("companyType")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Small Business">Small Business</SelectItem>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                  <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white/70">Status</Label>
              <Select value={formData.status} onValueChange={handleSelectChange("status")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Potential">Potential</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Former">Former</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-white/70">Priority</Label>
              <Select value={formData.priority} onValueChange={handleSelectChange("priority")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="source" className="text-white/70">Lead Source</Label>
            <Select value={formData.source} onValueChange={handleSelectChange("source")}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Advertisement">Advertisement</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street" className="text-white/70">Street Address</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={handleInputChange("street")}
              placeholder="123 Main Street"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white/70">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange("city")}
                placeholder="New York"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-white/70">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleInputChange("state")}
                placeholder="NY"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-white/70">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange("zipCode")}
                placeholder="10001"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-white/70">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={handleInputChange("country")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Primary Contact (Optional if same as above)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryContactName" className="text-white/70">Contact Name</Label>
              <Input
                id="primaryContactName"
                value={formData.primaryContactName}
                onChange={handleInputChange("primaryContactName")}
                placeholder="Leave empty to use main contact"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactTitle" className="text-white/70">Job Title</Label>
              <Input
                id="primaryContactTitle"
                value={formData.primaryContactTitle}
                onChange={handleInputChange("primaryContactTitle")}
                placeholder="CEO, Manager, etc."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryContactEmail" className="text-white/70">Email</Label>
              <Input
                id="primaryContactEmail"
                type="email"
                value={formData.primaryContactEmail}
                onChange={handleInputChange("primaryContactEmail")}
                placeholder="Leave empty to use main email"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactPhone" className="text-white/70">Phone</Label>
              <Input
                id="primaryContactPhone"
                value={formData.primaryContactPhone}
                onChange={handleInputChange("primaryContactPhone")}
                placeholder="Leave empty to use main phone"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Contact */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Secondary Contact (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secondaryContactName" className="text-white/70">Contact Name</Label>
              <Input
                id="secondaryContactName"
                value={formData.secondaryContactName}
                onChange={handleInputChange("secondaryContactName")}
                placeholder="Secondary contact name"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryContactTitle" className="text-white/70">Job Title</Label>
              <Input
                id="secondaryContactTitle"
                value={formData.secondaryContactTitle}
                onChange={handleInputChange("secondaryContactTitle")}
                placeholder="Assistant, Manager, etc."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secondaryContactEmail" className="text-white/70">Email</Label>
              <Input
                id="secondaryContactEmail"
                type="email"
                value={formData.secondaryContactEmail}
                onChange={handleInputChange("secondaryContactEmail")}
                placeholder="secondary@company.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryContactPhone" className="text-white/70">Phone</Label>
              <Input
                id="secondaryContactPhone"
                value={formData.secondaryContactPhone}
                onChange={handleInputChange("secondaryContactPhone")}
                placeholder="+1 (555) 123-4568"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white/70">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={handleInputChange("tags")}
              placeholder="Luxury, High-Value, Repeat Client (comma-separated)"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/70">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleInputChange("notes")}
              placeholder="Additional notes about this client..."
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0"
        >
          Add Client
        </Button>
      </div>
    </form>
  );
}