import { useState, useCallback } from "react";
import { getRandomQuestion, getSequentialQuestion, ALL_TOPICS } from "@/data/questions";
import QuizCard from "@/components/QuizCard";
import { Database, Filter, Shuffle, ListOrdered, CheckCircle, XCircle } from "lucide-react";

const Index = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [askedIds, setAskedIds] = useState<number[]>([]);
  const [question, setQuestion] = useState(() => getRandomQuestion());
  const [key, setKey] = useState(0);
  const [isRandom, setIsRandom] = useState(true);
  const [seqIndex, setSeqIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const pickNext = useCallback(() => {
    if (isRandom) {
      const next = getRandomQuestion([...askedIds, question.id], selectedTopic);
      setAskedIds(prev => [...prev, question.id]);
      setQuestion(next);
    } else {
      const { question: next, nextIndex } = getSequentialQuestion(seqIndex, selectedTopic);
      setSeqIndex(nextIndex);
      setQuestion(next);
    }
    setKey(k => k + 1);
  }, [askedIds, question.id, isRandom, seqIndex, selectedTopic]);

  const handleResult = useCallback((isCorrect: boolean) => {
    if (isCorrect) setCorrect(c => c + 1);
    else setWrong(w => w + 1);
  }, []);

  const handleTopicChange = (topic?: string) => {
    setSelectedTopic(topic);
    setAskedIds([]);
    setSeqIndex(0);
    if (isRandom) {
      setQuestion(getRandomQuestion([], topic));
    } else {
      const { question: next, nextIndex } = getSequentialQuestion(0, topic);
      setSeqIndex(nextIndex);
      setQuestion(next);
    }
    setKey(k => k + 1);
  };

  const toggleMode = () => {
    const newRandom = !isRandom;
    setIsRandom(newRandom);
    setAskedIds([]);
    setSeqIndex(0);
    if (newRandom) {
      setQuestion(getRandomQuestion([], selectedTopic));
    } else {
      const { question: next, nextIndex } = getSequentialQuestion(0, selectedTopic);
      setSeqIndex(nextIndex);
      setQuestion(next);
    }
    setKey(k => k + 1);
  };

  const total = correct + wrong;

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
          <div className="flex items-center gap-4">
            {/* Score */}
            <div className="flex items-center gap-3 text-sm font-mono">
              <div className="flex items-center gap-1 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold">{correct}</span>
              </div>
              <div className="flex items-center gap-1 text-destructive">
                <XCircle className="w-4 h-4" />
                <span className="font-bold">{wrong}</span>
              </div>
              {total > 0 && (
                <span className="text-xs text-muted-foreground">
                  {Math.round((correct / total) * 100)}%
                </span>
              )}
            </div>
            <div className="w-px h-8 bg-border" />
            {/* Count */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">Answered</p>
              <p className="font-heading font-bold text-foreground text-lg text-glow">
                {total}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-2xl mx-auto px-6 pt-6 space-y-4">
        {/* Mode toggle + Topic filter label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Filter by topic
            </span>
          </div>
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono border border-border bg-card hover:border-primary/30 hover:text-foreground text-muted-foreground transition-colors"
          >
            {isRandom ? (
              <>
                <Shuffle className="w-3.5 h-3.5" />
                Random
              </>
            ) : (
              <>
                <ListOrdered className="w-3.5 h-3.5" />
                Sequential
              </>
            )}
          </button>
        </div>

        {/* Topic chips */}
        <div className="flex flex-wrap gap-2">
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
        <QuizCard key={key} question={question} onNext={pickNext} onResult={handleResult} />
      </main>
    </div>
  );
};

export default Index;
