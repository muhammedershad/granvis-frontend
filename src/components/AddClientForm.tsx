"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { createClientSchema, type CreateClientFormData } from "@/lib/validations/client";
import { useCreateClientMutation } from "@/lib/api/clientsApi";
import { toast } from "sonner";
import { Loader2, AlertCircle, XCircle } from "lucide-react";

interface AddClientFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export function AddClientForm({ onSuccess, onCancel }: AddClientFormProps) {
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      dateOfBirth: "",
      gender: "",
      occupation: "",
      employer: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      spouseName: "",
      spousePhone: "",
      spouseEmail: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      status: "Potential",
      source: "Website",
      priority: "Medium",
      preferredContactMethod: "",
      preferredContactTime: "",
      architecturalStyle: "",
      budgetRange: "",
      notes: "",
      tags: "",
      createdBy: "Current User"
    }
  });

  const onSubmit = async (data: CreateClientFormData) => {
    // Clear previous error
    setSubmitError(null);

    try {
      const clientData = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        website: undefined,
        companyName: data.employer || `${data.firstName} ${data.lastName}`,
        companyType: 'Individual' as const,
        industry: data.occupation || 'Other',
        address: {
          street: data.street || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          country: data.country || "USA"
        },
        primaryContact: {
          name: `${data.firstName} ${data.lastName}`,
          title: data.occupation || 'Client',
          email: data.email,
          phone: data.phone
        },
        secondaryContact: data.spouseName ? {
          name: data.spouseName,
          title: 'Spouse',
          email: data.spouseEmail || "",
          phone: data.spousePhone || ""
        } : undefined,
        status: data.status,
        source: data.source,
        priority: data.priority,
        totalProjectValue: 0,
        projectsCount: 0,
        notes: data.notes || "",
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        projectIds: [],
        activeProjects: 0,
        completedProjects: 0,
        createdBy: data.createdBy
      };

      await createClient(clientData).unwrap();

      // Clear error and show success
      setSubmitError(null);
      toast.success("Client added successfully!", {
        description: `${data.firstName} ${data.lastName} has been added to your clients.`,
        duration: 4000,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create client:", error);

      // Extract error message from various error formats
      let errorMessage = "Failed to add client. Please try again.";
      const err = error as { data?: { message?: string } | string; message?: string };

      if (err?.data && typeof err.data === 'object' && err.data.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err?.data === 'string') {
        errorMessage = err.data;
      }

      // Set error state for visual display
      setSubmitError(errorMessage);

      // Show error toast with detailed message
      toast.error("Failed to Add Client", {
        description: errorMessage,
        duration: 5000,
      });

      // Scroll to top to show error alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Watch form values for select components
  const statusValue = watch("status");
  const priorityValue = watch("priority");
  const sourceValue = watch("source");
  const genderValue = watch("gender");
  const preferredContactMethodValue = watch("preferredContactMethod");
  const architecturalStyleValue = watch("architecturalStyle");
  const budgetRangeValue = watch("budgetRange");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alert */}
      {submitError && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-red-600 dark:text-red-400 font-semibold">Error Adding Client</AlertTitle>
          <AlertDescription className="text-red-600/90 dark:text-red-400/90">
            {submitError}
          </AlertDescription>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-red-600 dark:text-red-400 hover:bg-red-500/20"
            onClick={() => setSubmitError(null)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Form Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="bg-orange-500/10 border-orange-500/50">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-orange-600 dark:text-orange-400 font-semibold">
            Please Fix the Following Errors
          </AlertTitle>
          <AlertDescription className="text-orange-600/90 dark:text-orange-400/90">
            <ul className="list-disc list-inside space-y-1 mt-2">
              {errors.firstName && <li>First name is required</li>}
              {errors.lastName && <li>Last name is required</li>}
              {errors.email && <li>{errors.email.message}</li>}
              {errors.phone && <li>Phone number is required</li>}
              {errors.spouseEmail && <li>{errors.spouseEmail.message}</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

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
                {...register("firstName")}
                placeholder="John"
                className={`bg-white/5 border-white/10 text-white ${errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white/70">Last Name *</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Smith"
                className={`bg-white/5 border-white/10 text-white ${errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john.smith@email.com"
                className={`bg-white/5 border-white/10 text-white ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/70">Phone Number *</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+1 (555) 123-4567"
                className={`bg-white/5 border-white/10 text-white ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alternatePhone" className="text-white/70">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                {...register("alternatePhone")}
                placeholder="+1 (555) 987-6543"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-white/70">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white/70">Gender</Label>
              <Select value={genderValue} onValueChange={(value) => setValue("gender", value)}>
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
                {...register("occupation")}
                placeholder="Software Engineer"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employer" className="text-white/70">Employer</Label>
              <Input
                id="employer"
                {...register("employer")}
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
              {...register("street")}
              placeholder="123 Main Street"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white/70">City</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="New York"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-white/70">State</Label>
              <Input
                id="state"
                {...register("state")}
                placeholder="NY"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-white/70">ZIP Code</Label>
              <Input
                id="zipCode"
                {...register("zipCode")}
                placeholder="10001"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-white/70">Country</Label>
              <Input
                id="country"
                {...register("country")}
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
                  {...register("spouseName")}
                  placeholder="Jane Smith"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spousePhone" className="text-white/70">Phone</Label>
                <Input
                  id="spousePhone"
                  {...register("spousePhone")}
                  placeholder="+1 (555) 123-4568"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spouseEmail" className="text-white/70">Email</Label>
                <Input
                  id="spouseEmail"
                  type="email"
                  {...register("spouseEmail")}
                  placeholder="jane.smith@email.com"
                  className={`bg-white/5 border-white/10 text-white ${errors.spouseEmail ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.spouseEmail && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.spouseEmail.message}
                  </p>
                )}
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
                  {...register("emergencyContactName")}
                  placeholder="Emergency contact name"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship" className="text-white/70">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  {...register("emergencyContactRelationship")}
                  placeholder="Brother, Sister, Friend"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone" className="text-white/70">Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  {...register("emergencyContactPhone")}
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
              <Select value={statusValue} onValueChange={(value) => setValue("status", value as "Active" | "Inactive" | "Potential" | "Former")}>
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
              <Select value={priorityValue} onValueChange={(value) => setValue("priority", value as "Low" | "Medium" | "High" | "VIP")}>
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
              <Select value={sourceValue} onValueChange={(value) => setValue("source", value as "Referral" | "Website" | "Social Media" | "Advertisement" | "Cold Call" | "Other")}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredContactMethod" className="text-white/70">Preferred Contact Method</Label>
              <Select value={preferredContactMethodValue} onValueChange={(value) => setValue("preferredContactMethod", value)}>
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
                {...register("preferredContactTime")}
                placeholder="9 AM - 5 PM, Weekdays"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="architecturalStyle" className="text-white/70">Preferred Architectural Style</Label>
              <Select value={architecturalStyleValue} onValueChange={(value) => setValue("architecturalStyle", value)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select architectural style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modern">Modern</SelectItem>
                  <SelectItem value="Contemporary">Contemporary</SelectItem>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                  <SelectItem value="Victorian">Victorian</SelectItem>
                  <SelectItem value="Colonial">Colonial</SelectItem>
                  <SelectItem value="Craftsman">Craftsman</SelectItem>
                  <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="Minimalist">Minimalist</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Mid-Century Modern">Mid-Century Modern</SelectItem>
                  <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                  <SelectItem value="Ranch">Ranch</SelectItem>
                  <SelectItem value="Art Deco">Art Deco</SelectItem>
                  <SelectItem value="Scandinavian">Scandinavian</SelectItem>
                  <SelectItem value="Eco-Friendly/Sustainable">Eco-Friendly/Sustainable</SelectItem>
                  <SelectItem value="Mixed/Multiple Styles">Mixed/Multiple Styles</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetRange" className="text-white/70">Budget Range</Label>
              <Select value={budgetRangeValue} onValueChange={(value) => setValue("budgetRange", value)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under ₹10 Lakh">Under ₹10 Lakh</SelectItem>
                  <SelectItem value="₹10 Lakh - ₹25 Lakh">₹10 Lakh - ₹25 Lakh</SelectItem>
                  <SelectItem value="₹25 Lakh - ₹50 Lakh">₹25 Lakh - ₹50 Lakh</SelectItem>
                  <SelectItem value="₹50 Lakh - ₹75 Lakh">₹50 Lakh - ₹75 Lakh</SelectItem>
                  <SelectItem value="₹75 Lakh - ₹1 Crore">₹75 Lakh - ₹1 Crore</SelectItem>
                  <SelectItem value="₹1 Crore - ₹2 Crore">₹1 Crore - ₹2 Crore</SelectItem>
                  <SelectItem value="₹2 Crore - ₹5 Crore">₹2 Crore - ₹5 Crore</SelectItem>
                  <SelectItem value="₹5 Crore - ₹10 Crore">₹5 Crore - ₹10 Crore</SelectItem>
                  <SelectItem value="₹10 Crore - ₹25 Crore">₹10 Crore - ₹25 Crore</SelectItem>
                  <SelectItem value="Over ₹25 Crore">Over ₹25 Crore</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                  <SelectItem value="To Be Discussed">To Be Discussed</SelectItem>
                </SelectContent>
              </Select>
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
              {...register("tags")}
              placeholder="VIP, Luxury, Eco-Friendly (comma-separated)"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/70">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
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
          disabled={isLoading}
          className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Client...
            </>
          ) : (
            "Add Client"
          )}
        </Button>
      </div>
    </form>
  );
}
