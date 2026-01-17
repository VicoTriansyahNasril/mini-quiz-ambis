'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    expiresAt: string;
    onExpire: () => void;
}

export default function QuizTimer({ expiresAt, onExpire }: Props) {
    const expiredTriggered = useRef(false);

    const calculateTime = useCallback(() => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = differenceInSeconds(expiry, now);
        return Math.max(0, diff);
    }, [expiresAt]);

    const [timeLeft, setTimeLeft] = useState(calculateTime);

    useEffect(() => {
        if (calculateTime() <= 0 && !expiredTriggered.current) {
            expiredTriggered.current = true;
            onExpire();
            return;
        }

        const interval = setInterval(() => {
            const diff = calculateTime();
            setTimeLeft(diff);

            if (diff <= 0) {
                clearInterval(interval);
                if (!expiredTriggered.current) {
                    expiredTriggered.current = true;
                    onExpire();
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [calculateTime, onExpire]);

    const format = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isUrgent = timeLeft < 60;

    return (
        <div className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono font-bold transition-colors",
            isUrgent ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-50 text-blue-700"
        )}>
            <Timer size={18} />
            {format(timeLeft)}
        </div>
    );
}