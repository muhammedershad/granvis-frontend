import { FieldErrors } from "react-hook-form";
import { ProjectFormData } from "./schemas";
import {
  checkClientSectionCompletion,
  checkFinancialsSectionCompletion,
  checkIdentitySectionCompletion,
  checkLocationSectionCompletion,
  checkScopeSectionCompletion,
} from "./completionChecks";

interface SectionStatus {
  hasErrors: boolean;
  isCompleted: boolean;
}

interface FormSectionsResult {
  identity: SectionStatus;
  client: SectionStatus;
  scope: SectionStatus;
  financials: SectionStatus;
  location: SectionStatus;
}

export function getFormSections(
  errors: FieldErrors<ProjectFormData>,
  formData: ProjectFormData
): FormSectionsResult {
  // Error checks for each section
  const hasIdentityErrors = !!(
    errors.name ||
    errors.description ||
    errors.type ||
    errors.status ||
    errors.priority
  );
  const hasClientErrors = !!(
    errors.client ||
    errors.clientId ||
    errors.clientEmail ||
    errors.clientPhone
  );
  const hasScopeErrors = !!(
    errors.requirements ||
    errors.projectManager ||
    errors.managerId
  );
  const hasFinancialsErrors = !!(errors.startDate || errors.totalBudget);
  const hasLocationErrors = !!(errors.address || errors.city || errors.state);

  return {
    identity: {
      hasErrors: hasIdentityErrors,
      isCompleted: checkIdentitySectionCompletion(hasIdentityErrors, formData),
    },
    client: {
      hasErrors: hasClientErrors,
      isCompleted: checkClientSectionCompletion(hasClientErrors, formData),
    },
    scope: {
      hasErrors: hasScopeErrors,
      isCompleted: checkScopeSectionCompletion(hasScopeErrors, formData),
    },
    financials: {
      hasErrors: hasFinancialsErrors,
      isCompleted: checkFinancialsSectionCompletion(
        hasFinancialsErrors,
        formData
      ),
    },
    location: {
      hasErrors: hasLocationErrors,
      isCompleted: checkLocationSectionCompletion(hasLocationErrors, formData),
    },
  };
}
