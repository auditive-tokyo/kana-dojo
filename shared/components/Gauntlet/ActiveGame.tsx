'use client';

import React from 'react';
import clsx from 'clsx';
import {
  Heart,
  HeartCrack,
  X,
  Flame,
  SquareCheck,
  SquareX,
  MousePointerClick,
  Keyboard,
} from 'lucide-react';
import GauntletTypeAnswer from './GauntletTypeAnswer';
import GauntletWordBuildingAnswer from './GauntletWordBuildingAnswer';
import { type GauntletDifficulty, type GauntletGameMode } from './types';

interface ActiveGameProps<T> {
  // Dojo type for layout customization
  dojoType: 'kana' | 'kanji' | 'vocabulary';

  // Progress
  currentIndex: number;
  totalQuestions: number;

  // Lives
  lives: number;
  maxLives: number;
  difficulty: GauntletDifficulty;
  lifeJustGained: boolean;
  lifeJustLost: boolean;

  // Time
  elapsedTime: number;

  // Question display
  currentQuestion: T | null;
  renderQuestion: (question: T, isReverse?: boolean) => React.ReactNode;
  isReverseActive: boolean;

  // Game mode
  gameMode: GauntletGameMode;

  // Type mode
  inputPlaceholder: string;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;

  // Actions
  onCancel: () => void;
  onSubmit: () => void;
  onPickSubmit: (option: string) => void;

  // Pick mode
  shuffledOptions: string[];
  wrongSelectedAnswers: string[];
  renderOption?: (
    option: string,
    items: T[],
    isReverse?: boolean,
  ) => React.ReactNode;
  items: T[];

  // Feedback (kept for API compatibility but no longer displayed)
  getCorrectAnswer: (question: T, isReverse?: boolean) => string;
  lastAnswerCorrect: boolean | null;
  correctSinceLastRegen: number;
  regenThreshold: number;

  // Stats
  correctAnswers: number;
  wrongAnswers: number;
  currentStreak: number;
}

// Stat item component matching ReturnFromGame
const StatItem = ({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: number;
}) => (
  <p className='flex flex-row items-center gap-1 text-xl'>
    <Icon size={20} />
    <span>{value}</span>
  </p>
);

export default function ActiveGame<T>({
  dojoType,
  currentIndex,
  totalQuestions,
  lives,
  maxLives,
  difficulty: _difficulty,
  lifeJustGained: _lifeJustGained,
  lifeJustLost: _lifeJustLost,
  elapsedTime: _elapsedTime,
  currentQuestion,
  renderQuestion,
  isReverseActive,
  gameMode,
  inputPlaceholder,
  userAnswer,
  setUserAnswer,
  onSubmit,
  onPickSubmit,
  shuffledOptions,
  wrongSelectedAnswers,
  renderOption,
  items,
  getCorrectAnswer: _getCorrectAnswer,
  lastAnswerCorrect: _lastAnswerCorrect,
  correctSinceLastRegen: _correctSinceLastRegen,
  regenThreshold: _regenThreshold,
  correctAnswers,
  wrongAnswers,
  currentStreak,
  onCancel,
}: ActiveGameProps<T>) {
  const progressPercent = Math.round((currentIndex / totalQuestions) * 100);

  // Get game mode icon
  const ModeIcon = gameMode === 'Pick' ? MousePointerClick : Keyboard;

  return (
    <div
      className={clsx(
        'flex min-h-[100dvh] flex-col items-center px-4 pt-4 md:pt-8',
      )}
    >
      {/* Header section - matching ReturnFromGame layout */}
      <div className='flex w-full flex-col md:w-2/3 lg:w-1/2'>
        {/* Row 1: Exit button, Progress bar, Lives */}
        <div className='flex w-full flex-row items-center justify-between gap-4 md:gap-6'>
          {/* Exit Button */}
          <button
            onClick={onCancel}
            className='text-[var(--border-color)] duration-250 hover:cursor-pointer hover:text-[var(--secondary-color)]'
          >
            <X size={32} />
          </button>

          {/* Progress Bar - Gauntlet specific with percentage */}
          <div className='flex flex-1 flex-col gap-1'>
            <div className='h-3 w-full overflow-hidden rounded-full bg-[var(--card-color)]'>
              <div
                className='h-3 rounded-full bg-[var(--main-color)] transition-all duration-300'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className='flex justify-between text-xs text-[var(--muted-color)]'>
              <span>
                {currentIndex + 1} / {totalQuestions}
              </span>
              <span>{progressPercent}%</span>
            </div>
          </div>

          {/* Lives Display */}
          <div className='flex items-center gap-1'>
            {Array.from({ length: maxLives }).map((_, i) => {
              const hasLife = i < lives;
              return (
                <div key={i}>
                  {hasLife ? (
                    <Heart
                      size={24}
                      className='fill-[var(--main-color)] text-[var(--main-color)]'
                    />
                  ) : (
                    <HeartCrack
                      size={24}
                      className='text-[var(--border-color)]'
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Game mode and stats - matching ReturnFromGame exactly */}
        <div className='flex w-full flex-row items-center'>
          {/* Game mode indicator */}
          <p className='flex w-1/2 items-center justify-start gap-1 text-lg sm:gap-2 sm:pl-1 md:text-xl'>
            <ModeIcon className='text-[var(--main-color)]' />
            <span className='text-[var(--secondary-color)]'>
              {gameMode.toLowerCase()}
            </span>
          </p>

          {/* Stats display - matching ReturnFromGame */}
          <div className='flex w-1/2 flex-row items-center justify-end gap-1.5 py-2 text-[var(--secondary-color)] sm:gap-2 md:gap-3'>
            <StatItem icon={SquareCheck} value={correctAnswers} />
            <StatItem icon={SquareX} value={wrongAnswers} />
            <StatItem icon={Flame} value={currentStreak} />
          </div>
        </div>
      </div>

      {/* Main game area - centered with proper spacing */}
      <div className='flex w-full flex-1 flex-col items-center gap-8 sm:w-4/5 sm:gap-10'>
        {/* Question Display - matching Classic game layout */}
        <div className='flex flex-row items-center justify-center gap-1'>
          <p className='text-8xl font-medium sm:text-9xl'>
            {currentQuestion &&
              renderQuestion(currentQuestion, isReverseActive)}
          </p>
        </div>

        {/* Answer Area - layout based on dojoType and gameMode */}
        {gameMode === 'Type' ? (
          <GauntletTypeAnswer
            value={userAnswer}
            onChange={setUserAnswer}
            onSubmit={onSubmit}
            placeholder={inputPlaceholder}
          />
        ) : (
          <GauntletWordBuildingAnswer
            dojoType={dojoType}
            options={shuffledOptions}
            disabledOptions={wrongSelectedAnswers}
            onSubmit={onPickSubmit}
            renderOption={
              renderOption
                ? option => renderOption(option, items, isReverseActive)
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
