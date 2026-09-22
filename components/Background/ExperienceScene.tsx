"use client";

import { Project } from "../../types/project";
import CityCore from "./City/CityCore";
import CreativeDistrict from "./Creative/CreativeDistrict";
import DataCenter from "./Data/DataCenter";
import ExperienceTower from "./Experience/ExperienceTower";
import JourneyLandmarks from "./JourneyLandmarks";
import Planet from "./Planet/Planet";
import Atmosphere from "./Shared/Atmosphere";
import CameraRig from "./Shared/CameraRig";
import Lights from "./Shared/Lights";
import Particles3D from "./Shared/Particles3D";
import ScrollController from "./Shared/ScrollController";
import Stars3D from "./Shared/Stars3D";

interface ExperienceSceneProps {
  setSelectedProject: (project: Project | null) => void;
}

export default function ExperienceScene({
  setSelectedProject,
}: ExperienceSceneProps) {
  return (
    <>
      <Stars3D />
      <Lights />
      <Atmosphere />
      <Particles3D />
      <ScrollController />
      <CameraRig>
        <Planet />
        <CityCore setSelectedProject={setSelectedProject} />
        <ExperienceTower />
        <DataCenter />
        <CreativeDistrict />
        <JourneyLandmarks />
      </CameraRig>
    </>
  );
}
