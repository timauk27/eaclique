-- ========================================
-- TABELA: robot_logs (Logs do Robô)
-- ========================================
-- Armazena logs críticos do robô para monitoramento no CMS

CREATE TABLE IF NOT EXISTS public.robot_logs (
    id BIGSERIAL PRIMARY KEY,
    level TEXT NOT NULL,  -- DEBUG, INFO, WARNING, ERROR, CRITICAL
    message TEXT NOT NULL,
    context JSONB,  -- Contexto adicional (error_type, stacktrace, etc)
    component TEXT DEFAULT 'robo_visual',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_robot_logs_level ON public.robot_logs(level);
CREATE INDEX IF NOT EXISTS idx_robot_logs_timestamp ON public.robot_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_robot_logs_critical ON public.robot_logs(level, timestamp DESC) WHERE level IN ('ERROR', 'CRITICAL');

-- RLS
ALTER TABLE public.robot_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas autenticados podem ler logs"
ON public.robot_logs
FOR SELECT
USING (auth.role() = 'authenticated');

-- Service role pode inserir logs (robô usa service_role key)
CREATE POLICY "Service role pode inserir logs"
ON public.robot_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Auto-limpeza: deletar logs antigos (opcional, via cronjob ou function)
-- Manter apenas últimos 30 dias
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM public.robot_logs 
    WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.robot_logs IS 'Logs críticos do robô para monitoramento no CMS';
