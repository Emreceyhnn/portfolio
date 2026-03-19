import React from "react";
import type {
  ExamplePageState,
  ExamplePageActions,
  ProjectModel,
} from "../lib/type/example";
import { ProjectCard } from "./ProjectCard";
import { motion } from "framer-motion";

interface BentoGridProps {
  state: ExamplePageState;
  actions: ExamplePageActions;
}

export const ProjectGrid: React.FC<BentoGridProps> = ({ state, actions }) => {
  return (
    <div
      className="project-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 600px), 1fr))",
        gap: "32px",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px 0",
      }}
    >
      {state.projects.map((project: ProjectModel, index: number) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.8 }}
          viewport={{ once: true }}
          style={{ width: "100%" }}
        >
          <ProjectCard
            project={project}
            onSelect={actions.handleProjectClick}
            onPreview={actions.setPreviewProject}
          />
        </motion.div>
      ))}
    </div>
  );
};
