export interface ProjectModel {
  id: string;
  title: string;
  description: string;
  link: string;
  tech: string[];
}

export interface ExperienceModel {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
  tech: string[];
}

export interface SkillModel {
  category: 'Frontend' | 'Backend' | 'Databases' | 'APIs & Real-time' | 'DevOps & Tools' | 'Soft Skills';
  items: string[];
}

export interface EducationModel {
  id: string;
  institution: string;
  degree: string;
  period: string;
}

export interface ExamplePageState {
  projects: ProjectModel[];
  experience: ExperienceModel[];
  skills: SkillModel[];
  education: EducationModel[];
  languages: { language: string; proficiency: string }[];
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
  selectedProjectForPreview: ProjectModel | null;
}

export interface ExamplePageActions {
  fetchProjects: () => Promise<void>;
  handleProjectClick: (id: string) => void;
  setPreviewProject: (id: string | null) => void;
  resetState: () => void;
}

export interface ExamplePageProps {
  state: ExamplePageState;
  actions: ExamplePageActions;
}

export interface ProjectCardProps {
  project: ProjectModel;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
}
