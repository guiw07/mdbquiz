import { useState, useCallback } from "react";
import { getRandomQuestion } from "@/data/questions";
import QuizCard from "@/components/QuizCard";
import { Database } from "lucide-react";

const Index = () => {
  const [askedIds, setAskedIds] = useState<number[]>([]);
  const [question, setQuestion] = useState(() => getRandomQuestion());
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleNext = useCallback(() => {
    const newIds = [...askedIds, question.id];
    setAskedIds(newIds);
    setQuestion(getRandomQuestion(newIds));
  }, [askedIds, question.id]);

  // Track score from QuizCard via key reset
  const [key, setKey] = useState(0);

  const handleNextWithScore = useCallback(() => {
    handleNext();
    setKey(k => k + 1);
  }, [handleNext]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-foreground text-sm leading-tight">
                MongoDB Exam Prep
              </h1>
              <p className="text-xs text-muted-foreground">
                Associate Developer
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-mono">
              Questions answered
            </p>
            <p className="font-heading font-bold text-foreground text-lg text-glow">
              {askedIds.length}
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        <QuizCard key={key} question={question} onNext={handleNextWithScore} />
      </main>
    </div>
  );
};

export default Index;
