import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { Storage, AttachMoney } from "@mui/icons-material";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { getTranslations } from "../texts/translations";

interface PlatformData {
  name: string;
  revenue: string;
  dataVolume: string;
  description: string;
  color: string;
  revenueValue: number;
  dataValue: number;
}

const SocialMediaStats: React.FC = () => {
  const { currentTheme, colors } = useTheme();
  const { language } = useLanguage();
  const t = getTranslations(language);

  const platforms: PlatformData[] = [
    {
      name: t.socialMediaStats.platforms.meta.name,
      revenue: t.socialMediaStats.platforms.meta.revenue,
      dataVolume: t.socialMediaStats.platforms.meta.dataVolume,
      description: t.socialMediaStats.platforms.meta.description,
      color: colors.accent,
      revenueValue: 164.5,
      dataValue: 4.0,
    },
    {
      name: t.socialMediaStats.platforms.youtube.name,
      revenue: t.socialMediaStats.platforms.youtube.revenue,
      dataVolume: t.socialMediaStats.platforms.youtube.dataVolume,
      description: t.socialMediaStats.platforms.youtube.description,
      color: colors.accent,
      revenueValue: 36.1,
      dataValue: 0.5,
    },
    {
      name: t.socialMediaStats.platforms.tiktok.name,
      revenue: t.socialMediaStats.platforms.tiktok.revenue,
      dataVolume: t.socialMediaStats.platforms.tiktok.dataVolume,
      description: t.socialMediaStats.platforms.tiktok.description,
      color: colors.accent,
      revenueValue: 18.0,
      dataValue: 1.0,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: { xs: "100dvh", md: "100vh" },
        display: "flex",
        alignItems: "center",
        scrollSnapAlign: "start",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "3000px",
          height: "3000px",
          background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ margin: "-100px" }}
        >
          <Typography
            variant="h2"
            sx={{
              mt: { xs: 2 },
              textAlign: "center",
              mb: { xs: 2, md: 3 },
              fontWeight: "bold",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
            }}
          >
            {t.socialMediaStats.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: { xs: 4, md: 6 },
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
              opacity: 0.8,
              maxWidth: { xs: "90%", md: "800px" },
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
              px: { xs: 2, md: 0 },
              lineHeight: { xs: 1.4, md: 1.3 },
            }}
          >
            {t.socialMediaStats.description}
          </Typography>
        </motion.div>

        {/* Desktop: Grid Layout */}
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
            mb: 6,
          }}
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ margin: "-50px" }}
            >
              <Card
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
                  border: `1px solid ${colors.light}`,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      currentTheme === "darknight"
                        ? `0 8px 25px ${platform.color}40`
                        : `0 8px 25px ${platform.color}20`,
                    borderColor: platform.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color:
                          currentTheme === "darknight"
                            ? colors.textColorLight
                            : colors.textColorDark,
                        fontSize: "1.3rem",
                      }}
                    >
                      {platform.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.secondary,
                        fontSize: "0.9rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {platform.description}
                    </Typography>
                  </Box>

                  {/* Data Volume Display */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Storage
                        sx={{
                          fontSize: "1.5rem",
                          color: colors.secondary,
                          mr: 1,
                        }}
                      />
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: colors.secondary }}
                      >
                        {platform.dataVolume}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.secondary,
                        fontSize: "0.9rem",
                        opacity: 0.8,
                      }}
                    >
                      Daily Data Generation
                    </Typography>
                  </Box>

                  {/* Revenue Display */}
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AttachMoney
                        sx={{ fontSize: "1.5rem", color: colors.accent, mr: 1 }}
                      />
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: colors.accent }}
                      >
                        {platform.revenue}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.accent,
                        fontSize: "0.9rem",
                        opacity: 0.8,
                      }}
                    >
                      Annual Revenue
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Mobile: Stacked Layout */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            mb: { xs: 40, md: 4 },
          }}
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ margin: "-50px" }}
            >
              <Card
                sx={{
                  mb: 3,
                  background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
                  border: `1px solid ${colors.light}`,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      currentTheme === "darknight"
                        ? `0 8px 25px ${platform.color}40`
                        : `0 8px 25px ${platform.color}20`,
                    borderColor: platform.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color:
                        currentTheme === "darknight"
                          ? colors.textColorLight
                          : colors.textColorDark,
                      fontSize: "1.2rem",
                    }}
                  >
                    {platform.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondary,
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      mb: 3,
                    }}
                  >
                    {platform.description}
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid component="div">
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                          }}
                        >
                          <Storage
                            sx={{
                              fontSize: "1.2rem",
                              color: colors.secondary,
                              mr: 1,
                            }}
                          />
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", color: colors.secondary }}
                          >
                            {platform.dataVolume}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.secondary,
                            fontSize: "0.8rem",
                            opacity: 0.8,
                          }}
                        >
                          Daily Data
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid component="div">
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                          }}
                        >
                          <AttachMoney
                            sx={{
                              fontSize: "1.2rem",
                              color: colors.accent,
                              mr: 1,
                            }}
                          />
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", color: colors.accent }}
                          >
                            {platform.revenue}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.accent,
                            fontSize: "0.8rem",
                            opacity: 0.8,
                          }}
                        >
                          Annual Revenue
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SocialMediaStats;
