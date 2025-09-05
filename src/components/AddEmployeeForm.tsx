import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Employee } from "../types/employee";

interface AddEmployeeFormProps {
  onSubmit: (employee: Omit<Employee, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function AddEmployeeForm({ onSubmit, onCancel }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Employment Details
    employeeId: "",
    position: "",
    department: "",
    team: "",
    manager: "",
    hireDate: "",
    employmentStatus: "Active" as const,
    employmentType: "Full-time" as const,
    salary: "",
    
    // Personal Details
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    
    // Professional Details
    skills: "",
    experience: "",
    education: "",
    certifications: ""
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee: Omit<Employee, "id" | "createdAt" | "updatedAt"> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      employeeId: formData.employeeId,
      position: formData.position,
      department: formData.department,
      team: formData.team,
      manager: formData.manager,
      hireDate: formData.hireDate,
      employmentStatus: formData.employmentStatus,
      employmentType: formData.employmentType,
      salary: parseFloat(formData.salary) || 0,
      dateOfBirth: formData.dateOfBirth,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRelationship,
        phone: formData.emergencyContactPhone
      },
      skills: formData.skills.split(",").map(skill => skill.trim()).filter(Boolean),
      experience: parseInt(formData.experience) || 0,
      education: formData.education,
      certifications: formData.certifications.split(",").map(cert => cert.trim()).filter(Boolean)
    };

    onSubmit(employee);
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
              <Label htmlFor="firstName" className="text-white/70">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
                required
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
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/70">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
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
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-white/70">Employee ID *</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange("employeeId")}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-white/70">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={handleInputChange("position")}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-white/70">Department *</Label>
              <Select value={formData.department} onValueChange={handleSelectChange("department")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Interior Design">Interior Design</SelectItem>
                  <SelectItem value="Landscape">Landscape</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Project Management">Project Management</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team" className="text-white/70">Team</Label>
              <Input
                id="team"
                value={formData.team}
                onChange={handleInputChange("team")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-white/70">Manager</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={handleInputChange("manager")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hireDate" className="text-white/70">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleInputChange("hireDate")}
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentStatus" className="text-white/70">Employment Status</Label>
              <Select value={formData.employmentStatus} onValueChange={handleSelectChange("employmentStatus")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType" className="text-white/70">Employment Type</Label>
              <Select value={formData.employmentType} onValueChange={handleSelectChange("employmentType")}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-white/70">Annual Salary</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange("salary")}
              placeholder="0"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street" className="text-white/70">Street Address</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={handleInputChange("street")}
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
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-white/70">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleInputChange("state")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-white/70">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange("zipCode")}
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

      {/* Emergency Contact */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName" className="text-white/70">Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange("emergencyContactName")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship" className="text-white/70">Relationship</Label>
              <Input
                id="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleInputChange("emergencyContactRelationship")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone" className="text-white/70">Phone</Label>
              <Input
                id="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange("emergencyContactPhone")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Details */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-white/70">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange("experience")}
                placeholder="0"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education" className="text-white/70">Education</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={handleInputChange("education")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills" className="text-white/70">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={formData.skills}
              onChange={handleInputChange("skills")}
              placeholder="AutoCAD, Revit, 3D Modeling, Project Management"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications" className="text-white/70">Certifications (comma-separated)</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={handleInputChange("certifications")}
              placeholder="LEED AP, NCARB, PMP"
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
          Add Employee
        </Button>
      </div>
    </form>
  );
}