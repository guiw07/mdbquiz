import { useState, useCallback } from "react";
import { getRandomQuestion, ALL_TOPICS } from "@/data/questions";
import QuizCard from "@/components/QuizCard";
import { Database, Filter } from "lucide-react";

const Index = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [askedIds, setAskedIds] = useState<number[]>([]);
  const [question, setQuestion] = useState(() => getRandomQuestion());
  const [key, setKey] = useState(0);

  const pickNext = useCallback(
    (topic?: string, resetIds?: number[]) => {
      const ids = resetIds ?? askedIds;
      const next = getRandomQuestion([...ids, question.id], topic);
      setAskedIds([...ids, question.id]);
      setQuestion(next);
      setKey((k) => k + 1);
    },
    [askedIds, question.id]
  );

  const handleNext = useCallback(() => pickNext(selectedTopic), [pickNext, selectedTopic]);

  const handleTopicChange = (topic?: string) => {
    setSelectedTopic(topic);
    setAskedIds([]);
    const next = getRandomQuestion([], topic);
    setQuestion(next);
    setKey((k) => k + 1);
  };

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
              <p className="text-xs text-muted-foreground">Associate Developer</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-mono">Questions answered</p>
            <p className="font-heading font-bold text-foreground text-lg text-glow">
              {askedIds.length}
            </p>
          </div>
        </div>
      </header>

      {/* Topic Filter */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 mb-1">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Filter by topic
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => handleTopicChange(undefined)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
              !selectedTopic
                ? "bg-primary/20 border-primary/40 text-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            All Topics
          </button>
          {ALL_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicChange(topic)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                selectedTopic === topic
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-6">
        <QuizCard key={key} question={question} onNext={handleNext} />
      </main>
    </div>
  );
};

export default Index;
