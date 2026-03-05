import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Nest } from '@/lib/types';

export function useNests(options?: { includeRejected?: boolean }) {
  const [nests, setNests] = useState<Nest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('nests').select('*').order('created_at', { ascending: false });
    if (!options?.includeRejected) {
      query = query.neq('status', 'rejete');
    }
    const { data } = await query;
    if (data) setNests(data);
    setLoading(false);
  }, [options?.includeRejected]);

  useEffect(() => {
    fetch();

    // Realtime subscription
    const channel = supabase
      .channel('nests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nests' }, fetch)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetch]);

  return { nests, loading, refresh: fetch };
}
