import React from 'react';

interface IconProps {
    className?: string;
    size?: number;
}

// Insight/Radar icon for Overview header
export const InsightRadarIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 12L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" />
    </svg>
);

// Target/Opportunity icon for Jobs KPI
export const TargetOpportunityIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M12 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 18V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Network/Organization Graph icon for Companies KPI
export const NetworkGraphIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="12" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10.5 13.5L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
);

// Puzzle/Hierarchy icon for Domains KPI
export const HierarchyPuzzleIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6.5 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17.5 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 17.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Broadcast/Sharing icon for Posters KPI
export const BroadcastShareIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3C12 3 8 6 8 12C8 18 12 21 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 3C12 3 16 6 16 12C16 18 12 21 12 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12C3 12 6 8 12 8C18 8 21 12 21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12C3 12 6 16 12 16C18 16 21 12 21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Activity/Analytics icon for Recent Jobs section
export const ActivityAnalyticsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M3 12L7 8L11 12L15 6L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17L7 13L11 17L15 11L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="8" r="1.5" fill="currentColor" />
        <circle cx="11" cy="12" r="1.5" fill="currentColor" />
        <circle cx="15" cy="6" r="1.5" fill="currentColor" />
        <circle cx="21" cy="12" r="1.5" fill="currentColor" />
    </svg>
);

// Grid/Layers icon for All Domains section
export const GridLayersIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* 3x3 Grid representing multiple domains */}
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="21" y="3" width="0" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="12" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="12" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="21" width="6" height="0" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="21" width="6" height="0" rx="1.5" stroke="currentColor" strokeWidth="1.5" />

        {/* Layer effect - overlapping squares */}
        <path d="M19 5L21 7L19 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 19L7 21L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Connection dots */}
        <circle cx="9" cy="6" r="1" fill="currentColor" />
        <circle cx="15" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="15" r="1" fill="currentColor" />
        <circle cx="15" cy="15" r="1" fill="currentColor" />
    </svg>
);

// Job Listing/Opportunities icon (Briefcase + Search/Arrow)
export const JobListingIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Briefcase base */}
        <rect x="3" y="9" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 9V7C8 5.89543 8.89543 5 10 5H14C15.1046 5 16 5.89543 16 7V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* List lines inside briefcase representing opportunities */}
        <path d="M7 13H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 16H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Arrow pointing up-right (discovery/action) */}
        <path d="M15 13L17 11L19 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Accent dot */}
        <circle cx="13" cy="13" r="1" fill="currentColor" />
    </svg>
);

export default {
    InsightRadarIcon,
    TargetOpportunityIcon,
    NetworkGraphIcon,
    HierarchyPuzzleIcon,
    BroadcastShareIcon,
    ActivityAnalyticsIcon,
    GridLayersIcon,
    JobListingIcon,
};
