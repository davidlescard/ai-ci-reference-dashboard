import Chip from '@mui/material/Chip';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import Sync from '@mui/icons-material/Sync';
import type { Status } from './api';
import { statusStyles, type StatusIconName } from './tokens';

// Outline glyphs; MUI icons v9 no longer ships the older CheckCircleOutline/ErrorOutline names.
const ICONS: Record<StatusIconName, typeof Sync> = {
  clock: ScheduleOutlined,
  sync: Sync,
  'check-circle': CheckCircleOutlined,
  error: ErrorOutlined,
};

// The one status display for the table and the detail view (BR4.1). Text is the raw lowercase status;
// the static icon is decorative and hidden from assistive technology (BR4.2).
export function StatusBadge({ status }: { status: Status }) {
  const style = statusStyles[status];
  const Icon = ICONS[style.icon];
  return (
    <Chip
      size="small"
      label={status}
      icon={<Icon aria-hidden="true" fontSize="small" />}
      data-testid="status-badge"
      data-status={status}
      sx={{
        backgroundColor: style.background,
        color: style.foreground,
        fontWeight: 500,
        '& .MuiChip-icon': { color: style.foreground },
      }}
    />
  );
}
