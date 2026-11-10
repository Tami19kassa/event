import React from "react";

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function SafeStoryBody({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div className="space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
      {blocks.map((block, idx) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={idx} className="font-display text-xl sm:text-2xl text-slate-900 pt-3">
              {block.slice(3).trim()}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={idx} className="font-display text-lg text-slate-900 pt-2">
              {block.slice(4).trim()}
            </h3>
          );
        }

        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isBulletList = lines.length > 0 && lines.every((l) => /^[-*•]\s+/.test(l));

        if (isBulletList) {
          return (
            <ul key={idx} className="space-y-2 pl-5 list-disc marker:text-[var(--color-primary)]">
              {lines.map((line, i) => (
                <li key={i}>{renderInlineBold(line.replace(/^[-*•]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="whitespace-pre-line">
            {renderInlineBold(block)}
          </p>
        );
      })}
    </div>
  );
}
