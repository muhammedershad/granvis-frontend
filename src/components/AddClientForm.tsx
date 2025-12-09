import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Client } from "../types/client";

interface AddClientFormProps {
  onSubmit: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function AddClientForm({ onSubmit, onCancel }: AddClientFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    gender: "" as const,
    
    // Professional Information
    occupation: "",
    employer: "",
    
    // Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    
    // Family/Additional Contacts
    spouseName: "",
    spousePhone: "",
    spouseEmail: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    
    // Client Information
    status: "Potential" as const,
    source: "Website" as const,
    priority: "Medium" as const,
    
    // Preferences
    preferredContactMethod: "" as const,
    preferredContactTime: "",
    architecturalStyle: "",
    budgetRange: "",
    
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
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      website: undefined,
      companyName: formData.employer || `${formData.firstName} ${formData.lastName}`,
      companyType: 'Individual',
      industry: formData.occupation || 'Other',
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      primaryContact: {
        name: `${formData.firstName} ${formData.lastName}`,
        title: formData.occupation || 'Client',
        email: formData.email,
        phone: formData.phone
      },
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
      {/* Personal Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white/70">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                required
                placeholder="John"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white/70">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
                required
                placeholder="Smith"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                placeholder="john.smith@email.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alternatePhone" className="text-white/70">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleInputChange("alternatePhone")}
                placeholder="+1 (555) 987-6543"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-white/70">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange("dateOfBirth")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white/70">Gender</Label>
              <Select value={formData.gender} onValueChange={handleSelectChange("gender")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Professional Information (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-white/70">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={handleInputChange("occupation")}
                placeholder="Software Engineer"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employer" className="text-white/70">Employer</Label>
              <Input
                id="employer"
                value={formData.employer}
                onChange={handleInputChange("employer")}
                placeholder="Company Name"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
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

      {/* Family & Emergency Contacts */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Family & Emergency Contacts (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-white/80 text-sm mb-3">Spouse/Partner Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spouseName" className="text-white/70">Name</Label>
                <Input
                  id="spouseName"
                  value={formData.spouseName}
                  onChange={handleInputChange("spouseName")}
                  placeholder="Jane Smith"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spousePhone" className="text-white/70">Phone</Label>
                <Input
                  id="spousePhone"
                  value={formData.spousePhone}
                  onChange={handleInputChange("spousePhone")}
                  placeholder="+1 (555) 123-4568"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spouseEmail" className="text-white/70">Email</Label>
                <Input
                  id="spouseEmail"
                  type="email"
                  value={formData.spouseEmail}
                  onChange={handleInputChange("spouseEmail")}
                  placeholder="jane.smith@email.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div>
            <h4 className="text-white/80 text-sm mb-3">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-white/70">Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange("emergencyContactName")}
                  placeholder="Emergency contact name"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship" className="text-white/70">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleInputChange("emergencyContactRelationship")}
                  placeholder="Brother, Sister, Friend"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone" className="text-white/70">Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange("emergencyContactPhone")}
                  placeholder="+1 (555) 123-4569"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Status & Preferences */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Client Status & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <SelectItem value="Walk-in">Walk-in</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredContactMethod" className="text-white/70">Preferred Contact Method</Label>
              <Select value={formData.preferredContactMethod} onValueChange={handleSelectChange("preferredContactMethod")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Text">Text</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredContactTime" className="text-white/70">Preferred Contact Time</Label>
              <Input
                id="preferredContactTime"
                value={formData.preferredContactTime}
                onChange={handleInputChange("preferredContactTime")}
                placeholder="9 AM - 5 PM, Weekdays"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="architecturalStyle" className="text-white/70">Preferred Architectural Styles</Label>
              <Input
                id="architecturalStyle"
                value={formData.architecturalStyle}
                onChange={handleInputChange("architecturalStyle")}
                placeholder="Modern, Contemporary, Traditional (comma-separated)"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetRange" className="text-white/70">Budget Range</Label>
              <Input
                id="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange("budgetRange")}
                placeholder="$500,000 - $1,000,000"
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
              placeholder="VIP, Luxury, Eco-Friendly (comma-separated)"
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