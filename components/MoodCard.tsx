
import React from 'react';
import { MoodType } from '../types';

interface MoodCardProps {
  mood: MoodType;
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ mood, label, icon, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
        selected 
          ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] border-blue-400' 
          : 'glass hover:bg-white/10'
      } border`}
    >
      <span className="text-4xl mb-3">{icon}</span>
      <span className="font-semibold text-lg capitalize">{label}</span>
    </button>
  );
};

export default MoodCard;
