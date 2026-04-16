/**
 * Future CMO module entrypoint.
 *
 * This module is intentionally lightweight: it only reads JSON-based
 * configuration from Supabase table `cmo_config`. Clinical decision rules are
 * not hardcoded yet to keep data backward compatible and configurable.
 */
import { supabase } from '@/lib/supabaseClient';

export async function getCmoConfig(configKey: string) {
  return supabase.from('cmo_config').select('*').eq('config_key', configKey).maybeSingle();
}
