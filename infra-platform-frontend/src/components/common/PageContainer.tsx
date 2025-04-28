// PageContainer.tsx
import React, { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link, Stack, styled, useTheme, alpha, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigateNext } from '@mui/icons-material';

interface PageContainerProps {
  title: string;
  breadcrumbs?: { text: string; link?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const PageContent = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: 'calc(100vh - 180px)',
}));

const PageContainer = ({ title, breadcrumbs, actions, children }: PageContainerProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      <PageHeader>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: breadcrumbs ? 1 : 0
              }}
            >
              {title}
            </Typography>

            {breadcrumbs && (
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
                sx={{
                  '& .MuiBreadcrumbs-separator': {
                    mx: 1,
                    color: alpha(theme.palette.text.primary, 0.4),
                  }
                }}
              >
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return isLast || !crumb.link ? (
                    <Typography
                      key={index}
                      sx={{
                        fontWeight: isLast ? 600 : 400,
                        fontSize: '0.875rem',
                        color: isLast ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.7),
                      }}
                    >
                      {crumb.text}
                    </Typography>
                  ) : (
                    <Link
                      key={index}
                      component={RouterLink}
                      to={crumb.link}
                      underline="hover"
                      sx={{
                        fontWeight: 400,
                        fontSize: '0.875rem',
                        color: alpha(theme.palette.text.primary, 0.7),
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {crumb.text}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            )}
          </Box>

          {actions && <Box>{actions}</Box>}
        </Stack>
      </PageHeader>

      <PageContent>
        {children}
      </PageContent>
    </Box>
  );
};

export default PageContainer;