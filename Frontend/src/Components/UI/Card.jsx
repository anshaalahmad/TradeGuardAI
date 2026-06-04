import React from 'react';
import { useStaggerAnimation } from '../../hooks/useScrollAnimation';

/**
 * Card - Reusable card component with hover animations
 * 
 * @param {string} variant - 'default', 'bordered', 'elevated'
 * @param {boolean} hoverable - Enable hover effects
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Card content
 */
const Card = ({ 
  children, 
  variant = 'default', 
  hoverable = true, 
  className = '',
  onClick,
  as: Component = 'div',
  ...props 
}) => {
  const variantClasses = {
    default: 'card_main_wrapper',
    bordered: 'card_main_wrapper is-bordered',
    elevated: 'card_main_wrapper is-elevated',
    app: 'card_app_wrapper',
  };

  return (
    <Component
      className={`${variantClasses[variant] || variantClasses.default} ${hoverable ? 'is-hoverable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * CardHeader - Card header section
 */
export const CardHeader = ({ children, className = '' }) => (
  <div className={`card_app_header ${className}`}>
    {children}
  </div>
);

/**
 * CardBody - Card body/content section
 */
export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);

/**
 * CardGrid - Animated grid of cards
 */
export const CardGrid = ({ 
  children, 
  columns = 3, 
  className = '',
  animate = true,
}) => {
  const gridRef = useStaggerAnimation('.stagger-item');
  
  const gridClasses = {
    2: 'card-grid-2',
    3: 'card-grid-3',
    4: 'card-grid-4',
  };

  return (
    <div 
      ref={animate ? gridRef : null}
      className={`card-grid ${gridClasses[columns] || ''} ${className}`}
    >
      {React.Children.map(children, (child, index) => (
        <div key={index} className="stagger-item">
          {child}
        </div>
      ))}
    </div>
  );
};

export default Card;
