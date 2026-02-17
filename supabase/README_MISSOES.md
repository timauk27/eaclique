# Database Migration: Missões Table

## Purpose
This migration creates the `missoes` table to support the **Journalism on Demand** feature, allowing editors to request specific news coverage via the CMS.

## How to Apply

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `criar_tabela_missoes.sql`
4. Copy and paste the entire SQL content
5. Click **Run** to execute

### Option 2: Command Line (psql)
```bash
psql -h your-supabase-host -U postgres -d postgres -f supabase/criar_tabela_missoes.sql
```

## What This Creates

### Tables
- `missoes`: Stores mission requests from CMS

### ENUMs
- `tipo_missao_enum`: 'link_especifico', 'pesquisa_tematica'
- `status_missao_enum`: 'PENDENTE', 'EXECUTANDO', 'CONCLUIDA', 'ERRO'

### Indexes
- Fast lookups for pending missions (robot polling)
- Created date ordering (CMS dashboard)
- Category filtering

### Row Level Security (RLS)
- Only authenticated users can create/read/update missions
- Service role key can bypass for robot access

## Sample Data
The migration includes 2 example missions for testing:
1. **Link Específico**: Process a specific URL
2. **Pesquisa Temática**: Search for "Carnaval Rio 2026"

## Verification
After running, verify the table exists:
```sql
SELECT * FROM missoes ORDER BY created_at DESC LIMIT 5;
```

You should see 2 example missions with `status = 'PENDENTE'`.
