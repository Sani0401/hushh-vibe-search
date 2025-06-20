'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';

const questionsArray = [
  {
    question: "What are your plans for today?",
    options: ["Our products", "Our team", "Get recruited at Hushh", "Partner with us"],
    answer: []
  },
  {
    question: "What explains you the best?",
    options: ["User", "Agent", "Brand representative", "Fellow Developer", "Applicant"],
    answer: []
  }
];

// const HushhButton = dynamic(() => import('hushh-button-private-2').then(mod => mod.default || mod.HushhButton), {
//   ssr: false
// });

export default function HushhButtonWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const lastStoredOptions = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const query = searchParams.get('query') || '';
      setSearchQuery(query);

      try {
        const stored = localStorage.getItem('selectedOptions');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedOptions(parsed);
          lastStoredOptions.current = stored;
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
    }
  }, [searchParams]);

  // Poll localStorage for changes to hushhSelectedOptions
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      try {
        const currentStored = localStorage.getItem('selectedOptions');
        if (currentStored && currentStored !== lastStoredOptions.current) {
          lastStoredOptions.current = currentStored;
          const newOptions = JSON.parse(currentStored);
          setSelectedOptions(newOptions);

          // Update URL query param
          const newQuery = newOptions.join(' ');
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('query', newQuery);
          router.push(currentUrl.pathname + currentUrl.search);
          setSearchQuery(newQuery);

          console.log('Detected new options in localStorage. Updated query:', newQuery);
        }
      } catch (e) {
        console.error('Error parsing selectedOptions:', e);
      }
    }, 1000); // poll every 1 second

    return () => clearInterval(interval);
  }, [mounted, router]);

  const handleOptionsSelected = useCallback((options: string[]) => {
    setSelectedOptions(options);

    try {
      const json = JSON.stringify(options);
      localStorage.setItem('selectedOptions', json);
      lastStoredOptions.current = json;
      console.log('Options saved to localStorage:', options);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, pointerEvents: 'auto' }}>
      <HushhButton
        questions={questionsArray}
        searchTerm={searchQuery}
        onOptionsSelected={handleOptionsSelected}
      />
    </div>
  );
}
