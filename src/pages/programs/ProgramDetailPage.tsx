import { useMemo, type ReactNode } from 'react';
import { Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LoadingState, PageHeader, SectionCard, EmptyState } from '@/components/common';
import { StatusBadge, RagDot } from '@/components/status';
import { DataTable } from '@/components/tables';
import { programService } from '@/services';
import type { Milestone, TableColumn } from '@/types';
import { formatPercent, titleCase } from '@/utils';

export function ProgramDetailPage() {
  const { programId = '' } = useParams();
  const navigate = useNavigate();

  const { data: program, isLoading } = useQuery({
    queryKey: ['program-detail', programId],
    queryFn: () => programService.getProgramById(programId),
    enabled: Boolean(programId),
  });

  const milestoneRows = useMemo(() => program?.milestones ?? [], [program]);

  if (isLoading) {
    return <LoadingState label="Loading program detail…" />;
  }

  if (!program) {
    return (
      <EmptyState
        title="Program not found"
        description="The selected program is unavailable or outside the current dataset."
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader
        title={program.name}
        description={program.description}
        actions={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => navigate('/roadmap')}>
              Back to roadmap
            </Button>
            <Button size="small" component={RouterLink} to="/delivery" variant="text">
              Delivery
            </Button>
          </Stack>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
        }}
      >
        <DetailStat label="RAG" value={<StatusBadge status={program.rag} />} />
        <DetailStat label="Progress" value={formatPercent(program.percentComplete)} />
        <DetailStat label="Owner" value={program.owner.name} />
        <DetailStat label="Target date" value={program.targetDate} />
      </Box>

      <SectionCard
        title="Program summary"
        description="Key ownership, schedule, and financial signals."
      >
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <SummaryRow label="Code" value={program.code} />
          <SummaryRow label="Status" value={titleCase(program.status)} />
          <SummaryRow label="Executive sponsor" value={program.executiveSponsor.name} />
          <SummaryRow label="Business owner" value={program.businessOwner.name} />
          <SummaryRow label="Priority" value={titleCase(program.priority)} />
          <SummaryRow label="Start date" value={program.startDate} />
          <SummaryRow
            label="Budget"
            value={`${program.budget.currency} ${program.budget.amount.toLocaleString()}`}
          />
          <SummaryRow
            label="Actual cost"
            value={`${program.actualCost.currency} ${program.actualCost.amount.toLocaleString()}`}
          />
        </Box>
        {program.ragComment && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {program.ragComment}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={program.percentComplete}
            sx={{ mt: 0.75, height: 8, borderRadius: 999 }}
          />
        </Box>
      </SectionCard>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
        }}
      >
        <SectionCard title="Milestones" description="Program milestone timeline.">
          <DataTable
            columns={milestoneColumns}
            rows={milestoneRows}
            emptyMessage="No milestones for this program."
          />
        </SectionCard>

        <SectionCard title="Exceptions" description="Open blockers and high-severity risks.">
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Blockers ({program.blockers.length})</Typography>
            {program.blockers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No active blockers.
              </Typography>
            ) : (
              program.blockers.map((blocker) => (
                <Box key={blocker.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Chip size="small" label={titleCase(blocker.impact)} />
                  <Typography variant="body2">{blocker.description}</Typography>
                </Box>
              ))
            )}

            <Typography variant="subtitle2" sx={{ pt: 1 }}>
              Risks ({program.risks.length})
            </Typography>
            {program.risks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tracked risks.
              </Typography>
            ) : (
              program.risks.slice(0, 5).map((risk) => (
                <Box key={risk.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <RagDot
                    status={
                      risk.severity === 'critical' || risk.severity === 'high' ? 'red' : 'amber'
                    }
                  />
                  <Typography variant="body2">{risk.title}</Typography>
                </Box>
              ))
            )}
          </Stack>
        </SectionCard>
      </Box>
    </Box>
  );
}

function DetailStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ mt: 0.75 }}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography variant="h4">{value}</Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}

const milestoneColumns: TableColumn<Milestone>[] = [
  { id: 'name', label: 'Milestone' },
  { id: 'plannedDate', label: 'Target' },
  {
    id: 'percentComplete',
    label: 'Progress',
    align: 'right',
    render: (row) => formatPercent(row.percentComplete),
  },
  {
    id: 'status',
    label: 'Status',
    render: (row) => titleCase(row.status),
  },
];
