import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Nest } from '@/lib/types';

export function useNests() {
  const [nests, setNests] = useState<Nest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('nests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNests(data);
    setLoading(false);
  }, []);

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
