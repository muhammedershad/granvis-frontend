"use client";

import { EmployeesPageContent } from "./EmployeesPageContent";

interface EmployeesPageProps {
  onEmployeeSelect?: (employeeId: string) => void;
}

export function EmployeesPage({ onEmployeeSelect }: EmployeesPageProps) {
  return <EmployeesPageContent onEmployeeSelect={onEmployeeSelect} />;
}
