import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, FilterIcon, XIcon } from 'lucide-react';
import { getDateRange, formatDate } from '../lib/utils';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from 'react-day-picker';

type Period = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';
type BasePeriod = Exclude<Period, 'custom'>; // ⬅️ ini kunci fix

interface DateRangeFilterProps {
  onFilterChange: (startDate: string | undefined, endDate: string | undefined) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const periods: { value: BasePeriod; label: string }[] = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'year', label: 'Tahun Ini' },
    { value: 'all', label: 'Semua' },
  ];

  const handlePeriodChange = (period: BasePeriod) => {
    setSelectedPeriod(period);
    setCustomDateRange(undefined);

    const range = getDateRange(period); // ✅ sekarang aman
    if (range) {
      onFilterChange(range.startDate, range.endDate);
    } else {
      onFilterChange(undefined, undefined);
    }
  };

  const handleCustomDateChange = (range: DateRange | undefined) => {
    setCustomDateRange(range);

    if (range?.from && range?.to) {
      const startDate = range.from.toISOString().split('T')[0];
      const endDate = range.to.toISOString().split('T')[0];
      onFilterChange(startDate, endDate);
      setSelectedPeriod('custom');
    }
  };

  const handleClearCustom = () => {
    setCustomDateRange(undefined);
    setSelectedPeriod('month');

    const range = getDateRange('month');
    if (range) {
      onFilterChange(range.startDate, range.endDate);
    }
  };

  const getDisplayText = () => {
    if (selectedPeriod === 'custom' && customDateRange?.from && customDateRange?.to) {
      const startDate = customDateRange.from.toISOString().split('T')[0];
      const endDate = customDateRange.to.toISOString().split('T')[0];
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return periods.find(p => p.value === selectedPeriod)?.label || 'Pilih Periode';
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter Periode:</span>
        </div>

        <div className="flex flex-wrap gap-2 flex-1">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePeriodChange(period.value)}
            >
              {period.label}
            </Button>
          ))}

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedPeriod === 'custom' ? 'default' : 'outline'}
                size="sm"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Custom
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Pilih Rentang Tanggal</h4>
                  {customDateRange && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCustom}
                      className="h-auto p-1"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <DateRangePicker
                  value={customDateRange}
                  onChange={(range) => {
                    handleCustomDateChange(range);
                    if (range?.from && range?.to) {
                      setIsOpen(false);
                    }
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md whitespace-nowrap">
          <CalendarIcon className="h-4 w-4 inline mr-2" />
          {getDisplayText()}
        </div>
      </div>
    </Card>
  );
}