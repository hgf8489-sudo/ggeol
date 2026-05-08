import { useState, useCallback } from 'react';

const EMOJI_POOL = ['😭', '🥲', '😤', '💸', '📈', '😱', '🤯', '💀', '😩', '🫠'];

export function useEmojiEffect() {
  const [particles, setParticles] = useState([]);

  const burst = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      emoji: EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)],
      x: cx + (Math.random() - 0.5) * 80,
      y: cy,
    }));

    setParticles(p => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles(p => p.filter(pt => !newParticles.find(np => np.id === pt.id)));
    }, 900);
  }, []);

  return { particles, burst };
}

export function EmojiParticles({ particles }) {
  return (
    <>
      {particles.map(({ id, emoji, x, y }) => (
        <span
          key={id}
          className="pointer-events-none absolute text-2xl select-none"
          style={{
            left: x,
            top: y,
            animation: 'emojiRise 0.85s ease-out forwards',
            zIndex: 50,
          }}
        >
          {emoji}
        </span>
      ))}
    </>
  );
}
