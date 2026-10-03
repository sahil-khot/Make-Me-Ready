import * as LucideIcons from "lucide-react";

export const Icon = ({ n, ...props }) => {
  const IconComponent = LucideIcons[n] || LucideIcons.Circle;
  return <IconComponent {...props} />;
};
