"use client";

import { Key, useEffect, useState } from "react";
import { projectCard, projectImg } from "./ProjectsStyle";

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
      <h1>Projekt jag gjort </h1>
      {projects !== null &&
        projects.map(
          (project: {
            project_id: Key | undefined | null;
            name: string;
            description: string;
            image: string;
          }) => (
            <div key={project.project_id}>
              <h2>{project.name}</h2>
              <img
                src={`http://localhost:8080${project.image}`}
                alt="bild på projektet"
                style={{ width: "5rem", height: "auto" }}
              />
              <p>{project.description}</p>
            </div>
          )
        )}
    </>
  );
}

// https://stackoverflow.com/questions/30887225/use-special-characters-%C3%A5%C3%A4%C3%B6-in-the-postgresql-shell
