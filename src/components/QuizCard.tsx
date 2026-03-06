import { useState } from "react";
import { Question } from "@/data/questions";
import { Check, X, ExternalLink, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface QuizCardProps {
  question: Question;
  onNext: () => void;
}

const QuizCard = ({ question, onNext }: QuizCardProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.correctIndex;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
  };

  const copyCode = () => {
    if (question.code) {
      navigator.clipboard.writeText(question.code);
      toast.success("Code copied to clipboard!");
    }
  };

  const getOptionClass = (index: number) => {
    const base =
      "w-full text-left px-5 py-4 rounded-lg border transition-all duration-200 font-mono text-sm";

    if (!answered) {
      return `${base} border-border bg-secondary/50 hover:bg-secondary hover:border-primary/40 cursor-pointer`;
    }

    if (index === question.correctIndex) {
      return `${base} border-success bg-success/10 correct-glow`;
    }

    if (index === selectedIndex) {
      return `${base} border-destructive bg-destructive/10 wrong-glow`;
    }

    return `${base} border-border bg-secondary/30 opacity-50`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Topic badge */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-accent-foreground border border-primary/20">
          {question.topic}
        </span>
        <span className="text-muted-foreground text-xs font-mono">
          Q#{question.id}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl font-heading font-semibold leading-relaxed text-foreground">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={getOptionClass(index)}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-md border border-current/20 flex items-center justify-center text-xs font-bold opacity-60">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
              {answered && index === question.correctIndex && (
                <Check className="ml-auto w-5 h-5 text-success flex-shrink-0" />
              )}
              {answered &&
                index === selectedIndex &&
                index !== question.correctIndex && (
                  <X className="ml-auto w-5 h-5 text-destructive flex-shrink-0" />
                )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Result banner */}
          <div
            className={`p-4 rounded-lg border ${
              isCorrect
                ? "bg-success/5 border-success/30"
                : "bg-destructive/5 border-destructive/30"
            }`}
          >
            <p className={`font-heading font-bold text-lg ${isCorrect ? "text-success" : "text-destructive"}`}>
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </p>
            <p className="text-sm text-foreground/80 mt-1">
              {question.explanation}
            </p>
          </div>

          {/* Code snippet */}
          {question.code && (
            <div className="rounded-lg border border-border bg-muted overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
                <span className="text-xs text-muted-foreground font-mono">
                  mongosh
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent-foreground transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
              <pre className="p-4 text-sm text-foreground overflow-x-auto">
                <code>{question.code}</code>
              </pre>
            </div>
          )}

          {/* Doc link */}
          {question.docUrl && (
            <a
              href={question.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              MongoDB Documentation →
            </a>
          )}

          {/* Next button */}
          <button
            onClick={onNext}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-heading font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
