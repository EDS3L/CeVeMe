import React, { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { debounce } from '../../utils/debounce';
import Suggestions from './Suggestions';
import Suggest from './Suggest';

export default function SearchHero({
  query,
  onQuery,
  onOpenFilters,
  suggestions,
}) {
  const [local, setLocal] = useState(query);
  const [openSug, setOpenSug] = useState(false);
  const debounced = useRef(debounce(onQuery, 300));
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => setLocal(query), [query]);

  // zamykanie po kliknięciu poza / ESC
  useEffect(() => {
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpenSug(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenSug(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const mergedItems = [
    ...(suggestions?.cities ?? []),
    ...(suggestions?.techs ?? []),
  ];

  // warunek otwarcia – input w focusie + min 2 znaki lub są podpowiedzi
  const shouldOpen =
    openSug &&
    document.activeElement === inputRef.current &&
    (local.trim().length >= 2 || mergedItems.length > 0);

  const onPick = (it) => {
    const token = it.label;
    const next = (local ? `${local} ` : '') + token;
    setLocal(next);
    debounced.current(next);
    setOpenSug(false);
  };

  return (
    <section className="relative overflow-hidden">
      {/* tło nie przechwytuje klików */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ivorymedium via-ivorylight to-ivorylight"></div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-bookcloth to-kraft shadow-lg mb-4">
            <Search className="w-8 h-8 text-basewhite" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-bookcloth to-kraft bg-clip-text text-transparent">
            Wyszukiwarka ofert pracy
          </h1>
          <p className="mt-2 text-cloudmedium">
            Wpisz stanowisko, firmę, technologię lub miasto. Skorzystaj z
            filtrów dla precyzyjnych wyników.
          </p>
        </div>

        <div className="mt-8">
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-bookcloth to-kraft blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div
              className="relative rounded-2xl bg-ivorylight/90 backdrop-blur-xl border border-basewhite/30 shadow-xl z-10"
              ref={boxRef}
            >
              <label htmlFor="search" className="sr-only">
                Szukaj
              </label>
              <div className="flex items-center gap-2 p-2 sm:p-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-bookcloth to-kraft text-basewhite">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  ref={inputRef}
                  id="search"
                  type="text"
                  value={local}
                  onFocus={() => setOpenSug(true)}
                  onBlur={() => setTimeout(() => setOpenSug(false), 120)}
                  onChange={(e) => {
                    setLocal(e.target.value);
                    debounced.current(e.target.value);
                    setOpenSug(true);
                  }}
                  placeholder="Np. Power BI, Java Developer, Warszawa…"
                  className="w-full bg-transparent outline-none text-slatedark placeholder-clouddark px-1 py-3"
                />
                <button
                  type="button"
                  onClick={onOpenFilters}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slatedark bg-ivorymedium hover:bg-ivorylight border border-cloudlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feedbackfocus"
                  aria-label="Pokaż filtry"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtry</span>
                </button>
              </div>

              {shouldOpen && (
                <div className="z-30 w-5">
                  <Suggest
                    items={mergedItems}
                    onPick={onPick}
                    anchorRef={boxRef}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
