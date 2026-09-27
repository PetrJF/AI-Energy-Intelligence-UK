alter table public.index_datapoints add column if not exists change_absolute numeric;
alter table public.index_datapoints add column if not exists change_from_baseline_percent numeric;
comment on column public.index_datapoints.change_absolute is 'Absolute change on the previous comparable period, in the same unit as value.';
comment on column public.index_datapoints.change_from_baseline_percent is 'Percentage change against the first period in the series.';

update public.index_datapoints d set change_absolute = v.abs_change, change_from_baseline_percent = v.from_base
from (values ('2020', null::numeric, null::numeric),
             ('2021', 0.29, 9.1),
             ('2022', 0.40, 21.7),
             ('2023', 0.28, 30.6),
             ('2024', 0.33, 41.2)) as v(period_label, abs_change, from_base)
where d.period_label = v.period_label
  and d.indicator_id = (select id from public.index_indicators where slug = 'gb-dc-electricity-consumption-desnz');