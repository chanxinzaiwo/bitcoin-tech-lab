import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, HelpCircle, Trophy, RotateCcw,
    ChevronRight, Award, Target, Zap, BookOpen, Star, Sparkles
} from 'lucide-react';
import { useLab } from '../store/LabContext';
import { Achievement, recordQuizCompletion, getRarityColor, getRarityLabel } from '../data/achievementsData';

export interface QuizQuestion {
    id: string;
    type: 'single' | 'multiple' | 'trueFalse';
    question: string;
    options: string[];
    correctAnswers: number[]; // indices of correct answers
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizData {
    moduleId: string;
    moduleName: string;
    questions: QuizQuestion[];
}

interface QuizProps {
    quizData: QuizData;
    onComplete?: (score: number, total: number) => void;
    onClose?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ quizData, onComplete, onClose }) => {
    const { isDarkMode } = useLab();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([]);
    const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

    const currentQuestion = quizData.questions[currentIndex];
    const progress = ((currentIndex + 1) / quizData.questions.length) * 100;

    const handleSelectAnswer = (index: number) => {
        if (isAnswered) return;

        if (currentQuestion.type === 'multiple') {
            setSelectedAnswers(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            );
        } else {
            setSelectedAnswers([index]);
        }
    };

    const handleSubmit = () => {
        if (selectedAnswers.length === 0) return;

        const isCorrect = arraysEqual(
            selectedAnswers.sort(),
            currentQuestion.correctAnswers.sort()
        );

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setAnswers(prev => [...prev, { questionId: currentQuestion.id, correct: isCorrect }]);
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentIndex < quizData.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswers([]);
            setIsAnswered(false);
        } else {
            setIsComplete(true);
            onComplete?.(score, quizData.questions.length);
            // Save to localStorage
            saveQuizResult(quizData.moduleId, score, quizData.questions.length);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswers([]);
        setIsAnswered(false);
        setScore(0);
        setIsComplete(false);
        setAnswers([]);
        setNewAchievements([]);
    };

    const arraysEqual = (a: number[], b: number[]) => {
        if (a.length !== b.length) return false;
        return a.every((val, idx) => val === b[idx]);
    };

    const saveQuizResult = (moduleId: string, score: number, total: number) => {
        try {
            // Save to quiz history
            const key = `btc_lab_quiz_${moduleId}`;
            const existing = localStorage.getItem(key);
            const history = existing ? JSON.parse(existing) : [];
            history.push({
                date: new Date().toISOString(),
                score,
                total,
                percentage: Math.round((score / total) * 100)
            });
            localStorage.setItem(key, JSON.stringify(history.slice(-10))); // Keep last 10 attempts

            // Record for achievement system
            const { newAchievements: earned } = recordQuizCompletion(moduleId, score, total);
            if (earned.length > 0) {
                setNewAchievements(earned);
            }
        } catch (e) {
            console.error('Failed to save quiz result', e);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-green-500';
            case 'medium': return 'text-amber-500';
            case 'hard': return 'text-red-500';
            default: return 'text-slate-500';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '简单';
            case 'medium': return '中等';
            case 'hard': return '困难';
            default: return difficulty;
        }
    };

    if (isComplete) {
        const percentage = Math.round((score / quizData.questions.length) * 100);
        const isPassed = percentage >= 60;

        return (
            <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <div className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isPassed
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-amber-500 to-orange-600'
                    }`}>
                        {isPassed ? (
                            <Trophy className="w-10 h-10 text-white" />
                        ) : (
                            <Target className="w-10 h-10 text-white" />
                        )}
                    </div>

                    <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {isPassed ? '恭喜通过!' : '继续加油!'}
                    </h2>

                    <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {quizData.moduleName} 测验完成
                    </p>

                    {/* Score Display */}
                    <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-xl mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${isPassed ? 'text-green-500' : 'text-amber-500'}`}>
                                {score}/{quizData.questions.length}
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>正确题数</div>
                        </div>
                        <div className={`w-px h-12 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${isPassed ? 'text-green-500' : 'text-amber-500'}`}>
                                {percentage}%
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>正确率</div>
                        </div>
                    </div>

                    {/* Answer Summary */}
                    <div className="flex justify-center gap-2 mb-6">
                        {answers.map((a, i) => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    a.correct
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                }`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* New Achievements */}
                    {newAchievements.length > 0 && (
                        <div className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <span className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                    新成就解锁!
                                </span>
                            </div>
                            <div className="space-y-2">
                                {newAchievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
                                    >
                                        <span className="text-2xl">{achievement.icon}</span>
                                        <div className="flex-1 text-left">
                                            <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {achievement.title}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {achievement.description}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="w-4 h-4" />
                                            <span className="font-bold text-sm">+{achievement.points}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleRestart}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${
                                isDarkMode
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <RotateCcw className="w-4 h-4" />
                            再试一次
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
                            >
                                完成
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {quizData.moduleName} 测验
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm ${getDifficultyColor(currentQuestion.difficulty)}`}>
                            {getDifficultyLabel(currentQuestion.difficulty)}
                        </span>
                        <span className={`text-sm font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {currentIndex + 1}/{quizData.questions.length}
                        </span>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                        }`}>
                            <HelpCircle className="w-4 h-4" />
                        </div>
                        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {currentQuestion.question}
                        </h3>
                    </div>
                    {currentQuestion.type === 'multiple' && (
                        <p className={`text-sm mt-2 ml-11 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            (多选题，请选择所有正确答案)
                        </p>
                    )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswers.includes(index);
                        const isCorrect = currentQuestion.correctAnswers.includes(index);
                        const showCorrect = isAnswered && isCorrect;
                        const showWrong = isAnswered && isSelected && !isCorrect;

                        return (
                            <button
                                key={index}
                                onClick={() => handleSelectAnswer(index)}
                                disabled={isAnswered}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                    showCorrect
                                        ? 'border-green-500 bg-green-500/10'
                                        : showWrong
                                        ? 'border-red-500 bg-red-500/10'
                                        : isSelected
                                        ? isDarkMode
                                            ? 'border-orange-500 bg-orange-500/10'
                                            : 'border-orange-500 bg-orange-50'
                                        : isDarkMode
                                        ? 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                        showCorrect
                                            ? 'border-green-500 bg-green-500 text-white'
                                            : showWrong
                                            ? 'border-red-500 bg-red-500 text-white'
                                            : isSelected
                                            ? 'border-orange-500 bg-orange-500 text-white'
                                            : isDarkMode
                                            ? 'border-slate-600'
                                            : 'border-slate-300'
                                    }`}>
                                        {showCorrect && <CheckCircle className="w-4 h-4" />}
                                        {showWrong && <XCircle className="w-4 h-4" />}
                                        {!isAnswered && isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className={`${
                                        showCorrect
                                            ? 'text-green-500 font-medium'
                                            : showWrong
                                            ? 'text-red-500'
                                            : isDarkMode
                                            ? 'text-slate-300'
                                            : 'text-slate-700'
                                    }`}>
                                        {option}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {isAnswered && (
                    <div className={`mt-6 p-4 rounded-xl ${
                        isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                    }`}>
                        <div className="flex items-start gap-2">
                            <Zap className={`w-5 h-5 shrink-0 mt-0.5 ${
                                selectedAnswers.every(a => currentQuestion.correctAnswers.includes(a)) &&
                                currentQuestion.correctAnswers.every(a => selectedAnswers.includes(a))
                                    ? 'text-green-500'
                                    : 'text-amber-500'
                            }`} />
                            <div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    解析
                                </div>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    当前得分: <span className="font-bold text-orange-500">{score}</span>
                </div>
                {!isAnswered ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswers.length === 0}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                            selectedAnswers.length === 0
                                ? isDarkMode
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                    >
                        提交答案
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
                    >
                        {currentIndex < quizData.questions.length - 1 ? '下一题' : '查看结果'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Quiz Button Component for modules
export const QuizButton: React.FC<{
    moduleId: string;
    onClick: () => void;
}> = ({ moduleId, onClick }) => {
    const { isDarkMode } = useLab();
    const [bestScore, setBestScore] = useState<number | null>(null);

    useEffect(() => {
        try {
            const key = `btc_lab_quiz_${moduleId}`;
            const data = localStorage.getItem(key);
            if (data) {
                const history = JSON.parse(data);
                const best = Math.max(...history.map((h: any) => h.percentage));
                setBestScore(best);
            }
        } catch (e) {
            // Ignore
        }
    }, [moduleId]);

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                isDarkMode
                    ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50'
                    : 'bg-orange-50 border-orange-200 hover:border-orange-300'
            }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'
            }`}>
                <Award className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-left">
                <div className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    测验挑战
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {bestScore !== null ? `最高分: ${bestScore}%` : '检验学习成果'}
                </div>
            </div>
            <ChevronRight className={`w-5 h-5 ml-auto ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
        </button>
    );
};

export default Quiz;
