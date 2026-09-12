export interface MetricRecord {
  name: string;
  value: number;
  count: number;
  min: number;
  max: number;
  sum: number;
  lastUpdated: number;
  tags?: Record<string, string>;
}

export interface RecordMetricOptions {
  tags?: Record<string, string>;
}

export class MetricsCollector {
  private readonly metrics = new Map<string, MetricRecord>();

  public record(name: string, value: number, options: RecordMetricOptions = {}): void {
    const current = this.metrics.get(name);

    if (!current) {
      this.metrics.set(name, {
        name,
        value,
        count: 1,
        min: value,
        max: value,
        sum: value,
        lastUpdated: Date.now(),
        tags: options.tags,
      });
      return;
    }

    current.count += 1;
    current.value = value;
    current.sum += value;
    current.min = Math.min(current.min, value);
    current.max = Math.max(current.max, value);
    current.lastUpdated = Date.now();

    if (options.tags) {
      current.tags = { ...current.tags, ...options.tags };
    }
  }

  public snapshot(): MetricRecord[] {
    return [...this.metrics.values()].map((metric) => ({ ...metric }));
  }

  public get(name: string): MetricRecord | undefined {
    const metric = this.metrics.get(name);
    return metric ? { ...metric } : undefined;
  }

  public reset(): void {
    this.metrics.clear();
  }
}

export function createMetricsCollector(): MetricsCollector {
  return new MetricsCollector();
}

export const PACKAGE_NAME = "@mahiva/metrics";

