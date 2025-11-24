/* collapsible accordion component for displaying expandable content sections
 * when activeKey equals accordionKey, children render. otherwise, fallback renders
 * when isLoading is true, skeleton renders
 * clicking accordion calls setActive with accordionKey
 */

import { Skeleton } from "antd";
import { Text } from "../";

type Props = React.PropsWithChildren<{
  accordionKey: string;
  activeKey?: string;
  setActive: (key?: string) => void;
  fallback: string | React.ReactNode;
  isLoading?: boolean;
  icon: React.ReactNode;
  label: string;
}>;

// loading skeleton matching accordion header layout
const AccordionHeaderSkeleton = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 24px",
      borderBottom: "1px solid #d9d9d9",
    }}
  >
    <Skeleton.Avatar size="small" shape="square" />
    <Skeleton.Input size="small" block style={{ height: 22 }} />
  </div>
);

export const Accordion = ({
  accordionKey,
  activeKey,
  setActive,
  fallback,
  icon,
  label,
  children,
  isLoading,
}: Props) => {
  // show loading state
  if (isLoading) return <AccordionHeaderSkeleton />;

  const isActive = activeKey === accordionKey;

  // toggle accordion open/closed, undefined closes all accordions
  const toggleAccordion = () => setActive(isActive ? undefined : accordionKey);

  return (
    <div
      style={{
        display: "flex",
        padding: "12px 24px",
        gap: 12,
        alignItems: "start",
        borderBottom: "1px solid #d9d9d9",
      }}
    >
      {/* fixed width icon section */}
      <div style={{ marginTop: 1, flexShrink: 0 }}>{icon}</div>

      {/* expanded view with label and children */}
      {isActive ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: 1,
          }}
        >
          <Text strong onClick={toggleAccordion} style={{ cursor: "pointer" }}>
            {label}
          </Text>
          {children}
        </div>
      ) : (
        // collapsed view showing only fallback content
        <div onClick={toggleAccordion} style={{ cursor: "pointer", flex: 1 }}>
          {fallback}
        </div>
      )}
    </div>
  );
};
