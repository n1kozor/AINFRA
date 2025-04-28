// PageContainer.tsx
import React, { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link, Stack, styled, useTheme, alpha } from '@mui/material';
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
  marginBottom: theme.spacing(4),
}));

const PageContent = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(
    theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
    theme.palette.mode === 'dark' ? 0.4 : 0.9
  ),
  borderRadius: '28px',
  padding: theme.spacing(3),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.2)'
    : '0 8px 32px rgba(0,0,0,0.08)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(
    theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    0.05
  )}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '28px',
    padding: '2px',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(63, 140, 255, 0.3), transparent)'
      : 'linear-gradient(135deg, rgba(41, 98, 255, 0.2), transparent)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  }
}));

const PageContainer = ({ title, breadcrumbs, actions, children }: PageContainerProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', p: 3 }}>
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
                fontWeight: 800,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #3f8cff, #83b9ff)'
                  : 'linear-gradient(90deg, #2962ff, #5686ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                mb: 1,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '40%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #2962ff, transparent)',
                  borderRadius: '4px',
                }
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
                        position: 'relative',
                        transition: 'all 0.2s',
                      }}
                    >
                      {crumb.text}
                    </Typography>
                  ) : (
                    <Link
                      key={index}
                      component={RouterLink}
                      to={crumb.link}
                      underline="none"
                      sx={{
                        fontWeight: 400,
                        fontSize: '0.875rem',
                        color: alpha(theme.palette.text.primary, 0.7),
                        position: 'relative',
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -2,
                          left: 0,
                          width: '0%',
                          height: '2px',
                          background: theme.palette.primary.main,
                          transition: 'width 0.2s',
                          borderRadius: '2px',
                        },
                        '&:hover::after': {
                          width: '100%',
                        }
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