export interface ProjectModel {
  id: string;
  title: string;
  description: string;
  link: string;
  /** Same-site case study page (static HTML), when one exists. */
  caseStudy?: string;
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
  category: 'Frontend' | 'Backend & APIs' | 'Databases' | 'Security' | 'DevOps & Infrastructure' | 'Monitoring' | 'Testing' | 'Soft Skills';
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
}

export interface ExamplePageActions {
  fetchProjects: () => Promise<void>;
  handleProjectClick: (id: string) => void;
  resetState: () => void;
}

export interface ExamplePageProps {
  state: ExamplePageState;
  actions: ExamplePageActions;
}

export interface ProjectCardProps {
  project: ProjectModel;
  /** Deprecated: cards now use real links. Kept so callers keep compiling. */
  onSelect?: (id: string) => void;
}
