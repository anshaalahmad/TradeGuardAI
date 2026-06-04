import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * AccordionItem - Animated expand/collapse FAQ item
 * 
 * @param {string} question - The question/title
 * @param {string|React.ReactNode} answer - The answer/content
 * @param {boolean} defaultOpen - Whether to start expanded
 * @param {string} id - Unique ID for accessibility
 */
const AccordionItem = ({ 
  question, 
  answer, 
  defaultOpen = false, 
  id,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const answerRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    const answer = answerRef.current;
    if (!content || !answer) return;

    if (isOpen) {
      // Expand animation
      gsap.set(content, { height: 'auto' });
      const height = content.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        { height, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      // Collapse animation
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle?.(!isOpen, id);
  };

  const buttonId = `accordion-button-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
      <button
        id={buttonId}
        className="accordion-header"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="accordion-question">{question}</span>
        <span className="accordion-icon" aria-hidden="true">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className={`accordion-chevron ${isOpen ? 'is-rotated' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        id={panelId}
        ref={contentRef}
        className="accordion-content"
        role="region"
        aria-labelledby={buttonId}
        style={{ height: defaultOpen ? 'auto' : 0, overflow: 'hidden' }}
      >
        <div ref={answerRef} className="accordion-answer">
          {typeof answer === 'string' ? <p>{answer}</p> : answer}
        </div>
      </div>
    </div>
  );
};

/**
 * Accordion - Container for multiple accordion items
 * 
 * @param {boolean} allowMultiple - Allow multiple items open at once
 * @param {React.ReactNode} children - AccordionItem components
 */
export const Accordion = ({ children, allowMultiple = false, className = '' }) => {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (isOpening, id) => {
    if (!allowMultiple) {
      setOpenId(isOpening ? id : null);
    }
  };

  // Clone children to pass toggle handler if not allowing multiple
  const items = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    const itemId = child.props.id || index;
    
    if (!allowMultiple) {
      return React.cloneElement(child, {
        id: itemId,
        onToggle: handleToggle,
        defaultOpen: openId === itemId,
      });
    }
    
    return React.cloneElement(child, { id: itemId });
  });

  return (
    <div className={`accordion ${className}`}>
      {items}
    </div>
  );
};

export default AccordionItem;
