"use client";
import { Card, Img, Container, Info } from "../general-css/GeneralStyles";
import { Key, useEffect, useState } from "react";

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
      <Container>
        <h1>Tidigare Projekt</h1>
        <p>Här kan man se några av de projekt jag tidigare gjort</p>
        {projects !== null &&
          projects.map(
            (project: {
              project_id: Key | undefined | null;
              name: string;
              description: string;
              image: string;
            }) => (
              <Card key={project.project_id}>
                <h2>{project.name}</h2>
                <Img
                  src={`http://localhost:8080${project.image}`}
                  alt="bild på projektet"
                />
                <Info>{project.description}</Info>
              </Card>
            )
          )}
      </Container>
    </>
  );
}

// https://stackoverflow.com/questions/30887225/use-special-characters-%C3%A5%C3%A4%C3%B6-in-the-postgresql-shell
