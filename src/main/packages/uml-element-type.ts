import { ActivityElementType } from './uml-activity-diagram';
import { ClassElementType } from './uml-class-diagram';
import { ComponentElementType } from './uml-component-diagram';
import { DeploymentElementType } from './uml-deployment-diagram';
import { ObjectElementType } from './uml-object-diagram';
import { UseCaseElementType } from './uml-use-case-diagram';
import { PetriNetElementType } from './uml-petri-net';
import { CommunicationElementType } from './uml-communication-diagram';

export type UMLElementType =
  | keyof typeof ClassElementType
  | keyof typeof ObjectElementType
  | keyof typeof ActivityElementType
  | keyof typeof UseCaseElementType
  | keyof typeof CommunicationElementType
  | keyof typeof ComponentElementType
  | keyof typeof DeploymentElementType
  | keyof typeof PetriNetElementType;

export const UMLElementType = {
  ...ClassElementType,
  ...ObjectElementType,
  ...ActivityElementType,
  ...UseCaseElementType,
  ...CommunicationElementType,
  ...ComponentElementType,
  ...DeploymentElementType,
  ...PetriNetElementType,
};
