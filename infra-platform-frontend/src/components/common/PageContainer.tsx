import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  styled,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  NavigateNextRounded,
  InfoOutlined,
  BookmarkBorderRounded,
  ShareRounded
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  breadcrumbs?: { text: string; link?: string }[];
  tags?: string[];
  actions?: ReactNode;
  helpText?: string;
  children: ReactNode;
}

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const PageContent = styled(motion.div)(({ theme }) => ({
  width: '100%',
  minHeight: 'calc(100vh - 180px)',
  position: 'relative',
}));

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  '& .MuiBreadcrumbs-separator': {
    mx: 1,
    color: alpha(theme.palette.text.primary, 0.3),
  },
  '& .MuiBreadcrumbs-ol': {
    alignItems: 'center',
  }
}));

const PageContainer = ({
  title,
  subtitle,
  icon,
  breadcrumbs,
  tags,
  actions,
  helpText,
  children
}: PageContainerProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            width: '100%',
            p: { xs: 2, sm: 2, md: 2 }, // Reduced padding on all sides
            pl: { xs: 2, sm: 2, md: 2 }, // Explicitly control left padding
            // The content should start very close to the sidebar
            maxWidth: '100%', // Allow content to use full width
          }}
        >
      <PageHeader
        component={motion.div}
        variants={itemVariants}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack spacing={1}>
            {breadcrumbs && (
              <StyledBreadcrumbs
                separator={<NavigateNextRounded fontSize="small" sx={{ opacity: 0.7, fontSize: '1rem' }} />}
                aria-label="breadcrumb"
              >
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return isLast || !crumb.link ? (
                    <Typography
                      key={index}
                      sx={{
                        fontWeight: isLast ? 600 : 500,
                        fontSize: '0.85rem',
                        color: isLast ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.6),
                        display: 'flex',
                        alignItems: 'center',
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
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        color: alpha(theme.palette.text.primary, 0.6),
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {crumb.text}
                    </Link>
                  );
                })}
              </StyledBreadcrumbs>
            )}

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: breadcrumbs ? 1 : 0 }}
            >
              {icon && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.12)})`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                    color: theme.palette.primary.main,
                  }}
                >
                  {icon}
                </Box>
              )}

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    letterSpacing: '-0.5px',
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                    lineHeight: 1.2,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {title}
                </Typography>

                {subtitle && (
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: 0.5,
                      color: alpha(theme.palette.text.primary, 0.6),
                      fontWeight: 400,
                      fontSize: '1rem',
                      maxWidth: '700px',
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>

            {tags && tags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: '24px',
                      '& .MuiChip-label': {
                        px: 1,
                      }
                    }}
                  />
                ))}
              </Stack>
            )}
          </Stack>

          {actions && (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              {helpText && (
                <Tooltip title={helpText} arrow placement="top">
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.info.main, 0.2),
                      }
                    }}
                  >
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={t('actions.save')} arrow placement="top">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                    }
                  }}
                >
                  <BookmarkBorderRounded fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={t('actions.share')} arrow placement="top">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.success.main, 0.2),
                    }
                  }}
                >
                  <ShareRounded fontSize="small" />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{
                mx: 1,
                height: '24px',
                opacity: 0.2,
                display: { xs: 'none', sm: 'block' }
              }} />

              {actions}
            </Box>
          )}
        </Stack>
      </PageHeader>

      <PageContent
        variants={itemVariants}
        sx={{
          position: 'relative',
        }}
      >
        {children}
      </PageContent>
    </Box>
  );
};

export default PageContainer;