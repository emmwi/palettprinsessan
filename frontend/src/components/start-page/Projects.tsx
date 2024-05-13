"use client";

import { Key, useEffect, useState } from "react";
import {
  ProjectCard,
  ProjectImg,
  ProjectContainer,
  ProjectInfo,
} from "./ProjectsStyle";

export default function about() {
  type Project = {
    project_id: number;
    name: string;
    description: string;
    image: string;
  };
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/projects")
      .then((response) => response.json())
      .then((result) => {
        setProjects(result);
      });
  }, []);

  return (
    <>
      <ProjectContainer>
        <h1>Tidigare Projekt</h1>
        {projects !== null &&
          projects.map(
            (project: {
              project_id: Key | undefined | null;
              name: string;
              description: string;
              image: string;
            }) => (
              <ProjectCard key={project.project_id}>
                <h2>{project.name}</h2>
                <ProjectImg
                  src={`http://localhost:8080${project.image}`}
                  alt="bild på projektet"
                />
                <ProjectInfo>{project.description}</ProjectInfo>
              </ProjectCard>
            )
          )}
      </ProjectContainer>
    </>
  );
}

// https://stackoverflow.com/questions/30887225/use-special-characters-%C3%A5%C3%A4%C3%B6-in-the-postgresql-shell
