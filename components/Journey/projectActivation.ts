export const PROJECT_ACTIVATION_EVENT = "journey:activate-project";

export interface ProjectActivationDetail {
  projectId: string;
}

export function activateJourneyProject(projectId: string) {
  window.dispatchEvent(
    new CustomEvent<ProjectActivationDetail>(PROJECT_ACTIVATION_EVENT, {
      detail: { projectId },
    })
  );
}