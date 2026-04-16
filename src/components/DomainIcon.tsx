import React from 'react';
import { getDomainIcon } from '@/lib/domain-icons';
import { cn } from '@/lib/utils';

interface DomainIconProps {
    domainName: string;
    className?: string;
    containerClassName?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'card' | 'header' | 'minimal';
}

const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
};

const containerSizeMap = {
    sm: 'p-2.5',
    md: 'p-3.5',
    lg: 'p-4',
    xl: 'p-5',
};

export const DomainIcon: React.FC<DomainIconProps> = ({
    domainName,
    className = '',
    containerClassName = '',
    size = 'md',
    variant = 'card',
}) => {
    const Icon = getDomainIcon(domainName);

    // Variant-specific styling - Stripe/LinkedIn Professional
    const variantStyles = {
        card: cn(
            'bg-slate-50/50 border border-slate-100 rounded-[14px]',
            'transition-all duration-300 group-hover:scale-105',
            containerSizeMap[size]
        ),
        header: cn(
            'bg-slate-50/50 rounded-[16px]',
            'border border-slate-100 shadow-sm',
            containerSizeMap[size]
        ),
        minimal: cn(
            'bg-slate-50/50 rounded-[8px] border border-slate-100',
            containerSizeMap[size]
        ),
    };

    const iconStyles = {
        card: 'transition-all duration-300',
        header: '',
        minimal: '',
    };

    return (
        <div className={cn(variantStyles[variant], containerClassName)}>
            <Icon className={cn(sizeMap[size], iconStyles[variant], className)} />
        </div>
    );
};

export default DomainIcon;
