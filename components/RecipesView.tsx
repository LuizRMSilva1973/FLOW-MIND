
import React from 'react';
import { RECIPES } from '../constants';
import { Recipe } from '../types';

interface RecipesViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipesView: React.FC<RecipesViewProps> = ({ onSelectRecipe }) => {
  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900">O que vamos automatizar hoje?</h2>
          <p className="text-slate-500 mt-2 text-lg">Escolha uma receita pronta e comece em segundos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECIPES.map(recipe => (
            <div 
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {recipe.icon}
              </div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">{recipe.category}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{recipe.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{recipe.description}</p>
              
              <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                Usar esta receita
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}

          <div className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-center items-center text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">Fluxo Sob Medida?</h3>
            <p className="text-indigo-100 text-sm mb-6">Fale com nossa IA para criar algo totalmente único para você.</p>
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm shadow-lg">Usar Assistente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesView;
