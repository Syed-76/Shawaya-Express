import React from 'react';
import tangyChickenPhoto from '../assets/images/tangy_chicken_dish_1787650784554.jpg';

interface TangyChickenDishGraphicProps {
  type?: 'full' | 'half';
  className?: string;
}

export const TangyChickenDishGraphic: React.FC<TangyChickenDishGraphicProps> = ({
  type = 'full',
  className = '',
}) => {
  return (
    <div className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-950 via-[#6b140b] to-[#3b0808] select-none ${className}`}>
      {/* Background warm grill glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.5) 0%, transparent 70%)`
        }}
      />

      {/* Realistic Dish Photo in Ceramic Tray Container */}
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl p-1.5 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.6)] border-2 border-white/90 overflow-hidden transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
        <img
          src={tangyChickenPhoto}
          alt={type === 'full' ? 'Full Tangy Chicken in Square Dish' : 'Half Tangy Chicken in Square Dish'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-xl"
        />
        {/* Subtle authentic glaze gloss */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent pointer-events-none rounded-xl" />
      </div>

      {/* Floating Tag */}
      <div className="absolute bottom-3 right-3 bg-red-600/95 backdrop-blur-sm border border-red-400 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md z-10">
        Tangy Glaze
      </div>
    </div>
  );
};

