import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Project } from "../types/project";

interface AddProjectFormProps {
  onSubmit: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function AddProjectForm({ onSubmit, onCancel }: AddProjectFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    description: "",
    client: "",
    clientEmail: "",
    clientPhone: "",
    
    // Project Details
    type: "Villa" as const,
    category: "",
    status: "Planning" as const,
    priority: "Medium" as const,
    
    // Timeline
    startDate: "",
    endDate: "",
    deadline: "",
    estimatedDuration: "",
    
    // Budget
    totalBudget: "",
    spentAmount: "0",
    
    // Progress
    progressPercentage: "0",
    currentPhase: "",
    
    // Team
    projectManager: "",
    teamMembers: "",
    
    // Location
    address: "",
    city: "",
    state: "",
    country: "USA",
    
    // Additional
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
    
    const project: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      description: formData.description,
      client: formData.client,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      type: formData.type,
      category: formData.category,
      status: formData.status,
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate,
      deadline: formData.deadline,
      estimatedDuration: parseInt(formData.estimatedDuration) || 0,
      totalBudget: parseFloat(formData.totalBudget) || 0,
      spentAmount: parseFloat(formData.spentAmount) || 0,
      remainingBudget: (parseFloat(formData.totalBudget) || 0) - (parseFloat(formData.spentAmount) || 0),
      progressPercentage: parseInt(formData.progressPercentage) || 0,
      currentPhase: formData.currentPhase,
      milestones: [],
      projectManager: formData.projectManager,
      teamMembers: formData.teamMembers.split(",").map(member => member.trim()).filter(Boolean),
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      documents: [],
      images: [],
      createdBy: formData.createdBy
    };

    onSubmit(project);
  };

  const getCategoryOptions = () => {
    switch (formData.type) {
      case "Villa":
        return ["Luxury Residential", "Family Home", "Vacation Villa", "Sustainable Housing"];
      case "Commercial":
        return ["Office Building", "Retail Complex", "Mixed-use Development", "Industrial Facility"];
      case "Interior":
        return ["Residential Interior", "Commercial Interior", "Hospitality Design", "Office Design"];
      case "Landscape":
        return ["Residential Landscape", "Commercial Landscape", "Urban Planning", "Educational Campus"];
      default:
        return [];
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                placeholder="Enter project name"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client" className="text-white/70">Client Name *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={handleInputChange("client")}
                required
                placeholder="Client or company name"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/70">Project Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange("description")}
              required
              placeholder="Describe the project goals and scope"
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="text-white/70">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleInputChange("clientEmail")}
                placeholder="client@email.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="text-white/70">Client Phone</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange("clientPhone")}
                placeholder="+1 (555) 123-4567"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white/70">Project Type *</Label>
              <Select value={formData.type} onValueChange={handleSelectChange("type")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                  <SelectItem value="Landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white/70">Category</Label>
              <Select value={formData.category} onValueChange={handleSelectChange("category")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategoryOptions().map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
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
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPhase" className="text-white/70">Current Phase</Label>
              <Input
                id="currentPhase"
                value={formData.currentPhase}
                onChange={handleInputChange("currentPhase")}
                placeholder="e.g., Design Development"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progressPercentage" className="text-white/70">Progress (%)</Label>
              <Input
                id="progressPercentage"
                type="number"
                min="0"
                max="100"
                value={formData.progressPercentage}
                onChange={handleInputChange("progressPercentage")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Budget */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Timeline & Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-white/70">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange("startDate")}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-white/70">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange("endDate")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-white/70">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange("deadline")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration" className="text-white/70">Duration (days)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                value={formData.estimatedDuration}
                onChange={handleInputChange("estimatedDuration")}
                placeholder="365"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalBudget" className="text-white/70">Total Budget ($) *</Label>
              <Input
                id="totalBudget"
                type="number"
                value={formData.totalBudget}
                onChange={handleInputChange("totalBudget")}
                required
                placeholder="1000000"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spentAmount" className="text-white/70">Amount Spent ($)</Label>
              <Input
                id="spentAmount"
                type="number"
                value={formData.spentAmount}
                onChange={handleInputChange("spentAmount")}
                placeholder="0"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team & Location */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Team & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectManager" className="text-white/70">Project Manager *</Label>
              <Input
                id="projectManager"
                value={formData.projectManager}
                onChange={handleInputChange("projectManager")}
                required
                placeholder="Project manager name"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamMembers" className="text-white/70">Team Members</Label>
              <Input
                id="teamMembers"
                value={formData.teamMembers}
                onChange={handleInputChange("teamMembers")}
                placeholder="Name 1, Name 2, Name 3"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white/70">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange("address")}
                placeholder="Street address"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white/70">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange("city")}
                placeholder="City"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-white/70">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleInputChange("state")}
                placeholder="State"
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
              placeholder="Luxury, Sustainable, Modern (comma-separated)"
              className="bg-white/5 border-white/10 text-white"
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
          Create Project
        </Button>
      </div>
    </form>
  );
}