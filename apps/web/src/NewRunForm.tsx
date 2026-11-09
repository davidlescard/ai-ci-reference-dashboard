import { useState, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { api, ApiError, type FieldErrors } from './api';

export function NewRunForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const run = await api.createRun({ name, branch, notes });
      setSuccess(`Created run "${run.name}"`);
      setName('');
      setBranch('');
      setNotes('');
      onCreated();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      else setFormError('Unable to create the run. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // No `required` on the fields: MUI would append " *" to the label and change the accessible name (BR6.1).
  // `error` is always a boolean, so every field renders aria-invalid as "true" or "false".
  return (
    <Card component="section" aria-labelledby="new-run-heading" data-testid="new-run">
      <CardContent>
        <Stack component="form" onSubmit={onSubmit} noValidate spacing={2}>
          <Typography variant="h2" component="h2" id="new-run-heading">
            Create test run
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id="new-run-name"
              label="Name"
              size="small"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              slotProps={{ htmlInput: { 'data-testid': 'new-run-name-input' } }}
            />
            <TextField
              id="new-run-branch"
              label="Branch"
              size="small"
              fullWidth
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              error={!!errors.branch}
              helperText={errors.branch}
              slotProps={{ htmlInput: { 'data-testid': 'new-run-branch-input' } }}
            />
          </Stack>
          <TextField
            id="new-run-notes"
            label="Notes"
            size="small"
            fullWidth
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            error={!!errors.notes}
            helperText={errors.notes}
            slotProps={{ htmlInput: { 'data-testid': 'new-run-notes-input' } }}
          />
          {formError && <Alert severity="error">{formError}</Alert>}
          {success && <Typography role="status">{success}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            data-testid="new-run-create-button"
            sx={{ alignSelf: 'flex-start' }}
          >
            Create run
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
