export function formatPostDuration(iso_date_string: string): string {
    const created_at = new Date(iso_date_string);

    const now = new Date();

    const deltaMs = now.getTime() - created_at.getTime();
    
    const min = 60 * 1000;
    const hr = 60 * min;
    const d = 24 * hr;
    const w = 7 * d;

    if (deltaMs < hr) {
        const m = Math.floor(deltaMs / min);
        return m <= 0 ? '1m' : `${m}m`;
        
    } else if (deltaMs < d) {
        const day = Math.floor(deltaMs / d);
        return day <= 0 ? '1d' : `${day}d`;

    } else if (deltaMs < w) {
        const week = Math.floor(deltaMs / w);
        return week <= 0 ? '1w' : `${week}w`;

    } else {
        return created_at.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }
}