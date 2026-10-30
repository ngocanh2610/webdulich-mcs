import React from 'react';

const renderInlineFormatting = (line, keyPrefix) => {
  if (!line) return null;
  const parts = line.split(/(\*\*[^*\n]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-b-${idx}`} style={{ fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-t-${idx}`}>{part}</React.Fragment>;
  });
};

export const FormattedText = ({ text, style }) => {
  if (text === null || text === undefined) return null;
  const normalized = String(text).replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      {lines.map((rawLine, lineIdx) => {
        const trimmed = rawLine.trim();
        if (!trimmed) {
          return <div key={`sp-${lineIdx}`} style={{ height: '4px' }} />;
        }

        const bulletMatch = trimmed.match(/^(?:[•\-*])\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div
              key={`bl-${lineIdx}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px',
                paddingLeft: '2px'
              }}
            >
              <span style={{ opacity: 0.85, flexShrink: 0, lineHeight: 1.5 }}>•</span>
              <span style={{ flex: 1 }}>{renderInlineFormatting(bulletMatch[1], `bl-${lineIdx}`)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+[.)])\s+(.*)$/);
        if (numMatch) {
          return (
            <div
              key={`nm-${lineIdx}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px',
                paddingLeft: '2px'
              }}
            >
              <strong style={{ fontWeight: 700, flexShrink: 0 }}>{numMatch[1]}</strong>
              <span style={{ flex: 1 }}>{renderInlineFormatting(numMatch[2], `nm-${lineIdx}`)}</span>
            </div>
          );
        }

        return (
          <div key={`ln-${lineIdx}`}>
            {renderInlineFormatting(trimmed, `ln-${lineIdx}`)}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedText;

