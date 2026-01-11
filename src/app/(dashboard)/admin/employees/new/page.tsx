'use client';

import { useRouter } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AddEmployeeForm } from "@/components/AddEmployeeForm";
import { toast } from "sonner";
import { Employee } from "@/types/employee";

export default function NewEmployeePage() {
  const router = useRouter();

  const handleAddEmployee = async (newEmployee: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    try {
      // In a real app, this would be an API call
      // For now we'll simulate a success and redirect
      // The actual mock data update happens in EmployeesPage state which won't persist
      // So detailed implementation would depend on global state or API
      console.log("Creating employee:", newEmployee);
      toast.success("Employee added successfully");
      router.push('/admin/employees');
    } catch (err) {
      console.error("Failed to create employee:", err);
      toast.error("Error creating employee");
    }
  };

  const handleCancel = () => {
    router.push('/admin/employees');
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN, IAuthRoles.MANAGER]}>
      <div className="container mx-auto py-8">
        <AddEmployeeForm 
          onSubmit={handleAddEmployee} 
          onCancel={handleCancel} 
        />
      </div>
    </RoleGuard>
  );
}
