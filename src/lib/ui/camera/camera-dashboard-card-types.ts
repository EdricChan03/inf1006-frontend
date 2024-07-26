export interface CameraDashboardCardProps {
  cameraBase64Src: string | null;
  lastUpdated: Date;

  formatDate?: (date: Date) => string;
}
