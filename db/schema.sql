-- Canonical Production Event Store Schema
-- Optimized for Replay Integrity and Temporal Analysis

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    type TEXT NOT NULL,
    source TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    correlation_id TEXT NOT NULL,
    causation_id TEXT,
    sequence BIGINT NOT NULL,
    event_clock BIGINT NOT NULL,
    partition_key TEXT,
    schema_version INT NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB,
    signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for high-performance correlation and temporal reconstruction
CREATE INDEX IF NOT EXISTS idx_events_correlation ON events(correlation_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_source ON events(source);

-- Partitioning strategy for horizontal scaling
-- ALTER TABLE events DETACH PARTITION events_y2026m05;
