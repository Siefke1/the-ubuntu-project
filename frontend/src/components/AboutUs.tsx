import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import {
  ArrowBack,
  LinkedIn,
  Twitter,
  GitHub,
  Email,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
// import { useLanguage } from "../hooks/useLanguage";
// import { getTranslations } from "../texts/translations";

interface TeamMember {
  id: number;
  name: string;
  username: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
}

const AboutUs: React.FC = () => {
  const { currentTheme, colors } = useTheme();
  //   const { language } = useLanguage();
  //   const t = getTranslations(language);

  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "León Siewert-Langhoff",
      username: "@siefke",
      role: "Founder",
      bio: "Based in Berlin, León has studied Classical Music since he was 12 years old, only to decide 12 years later, that he would prefer to work in theatre. Fast forward another 7 years, a global pandemic hit, also freezing stages everywhere, while León was in fact working as a Theatre Director, prompting him to learn how to code. Since then he has been working as a Software Engineer for various companies, pursuing his passion for theatre and music on the side. Oh Lord, here goes another one.",
      image:
        "https://avatars.githubusercontent.com/u/89452234?s=400&u=b70b2f5a8e537bd789c313f1f3a5a26893c42aaf&v=4",
      social: {
        email: "leon.langhoff@ubuntu-project.com",
        github: "https://github.com/siefke1",
      },
    },
    {
      id: 2,
      name: "Ivan Schlagheck",
      username: "@tvmb4",
      role: "Founder",
      bio: "Ivan originally comes from the arts. Growing up in Buenos Aires, he founded a theatre company at the age of 16, resulting in countless performances over a span of 4 years, with him filling the roles of a Director, Sound Engineer and Producer. After moving to Berlin he and León met in a coding school. Today he is working as a Freelance Software Engineer and Lecturer for Software and Web Development. Some day, he says, he will reunite his old company and blow us all away. Sure thing buddy.",
      image: "https://avatars.githubusercontent.com/u/80355578?v=4",
      social: {
        email: "ivan.schlagheck@ubuntu-project.com",
        github: "https://github.com/IvanSchlagheck",
      },
    },
    // {
    //   id: 3,
    //   name: "Elisabeth Neumann",
    //   username: "@nor3",
    //   role: "Founder",
    //   bio: "Emily brings creativity and user-centered thinking to everything we build. Her background in UX/UI design and passion for accessible technology ensures our platform is beautiful and inclusive. She leads our design team in creating experiences that truly serve our community.",
    //   image:
    //     "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flive.staticflickr.com%2F8779%2F18082508486_ba63564529.jpg&f=1&nofb=1&ipt=b07d0053d7aec3128759662f67584863ecb8d3f625c1f14869529e3db629f16d",
    //   social: {
    //     linkedin: "https://linkedin.com/in/emilyrodriguez",
    //     twitter: "https://twitter.com/emilyrodriguez",
    //     email: "emily@ubuntu-project.com",
    //   },
    // },
    // {
    //   id: 4,
    //   name: "David Thompson",
    //   username: "@davidthompson",
    //   role: "Lead Developer",
    //   bio: "David is a full-stack developer with a passion for clean code and innovative solutions. His expertise in modern web technologies and commitment to best practices helps us build robust, maintainable systems. He's also an active contributor to open-source projects.",
    //   image:
    //     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    //   social: {
    //     linkedin: "https://linkedin.com/in/davidthompson",
    //     github: "https://github.com/davidthompson",
    //     email: "david@ubuntu-project.com",
    //   },
    // },
    // {
    //   id: 5,
    //   name: "Lisa Park",
    //   username: "@lisapark",
    //   role: "Community Manager",
    //   bio: "Lisa is the heart of our community, fostering connections and ensuring every member feels welcome. Her background in community organizing and passion for inclusive spaces helps us build a platform where everyone can thrive. She's dedicated to creating meaningful relationships within our ecosystem.",
    //   image:
    //     "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    //   social: {
    //     linkedin: "https://linkedin.com/in/lisapark",
    //     twitter: "https://twitter.com/lisapark",
    //     email: "lisa@ubuntu-project.com",
    //   },
    // },
    // {
    //   id: 6,
    //   name: "Alex Kumar",
    //   role: "Product Manager",
    //   bio: "Alex bridges the gap between our community's needs and our technical capabilities. With a background in product strategy and user research, he ensures we're building features that truly matter. His data-driven approach and empathy for users guide our product roadmap.",
    //   image:
    //     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    //   social: {
    //     linkedin: "https://linkedin.com/in/alexkumar",
    //     github: "https://github.com/alexkumar",
    //     email: "alex@ubuntu-project.com",
    //   },
    // },
  ];

  // Scroll-based animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector("[data-scroll-container]");
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollProgress = Math.min(scrollTop / scrollHeight, 1);

      document.documentElement.style.setProperty(
        "--scroll-progress",
        scrollProgress.toString()
      );
    };

    const scrollContainer = document.querySelector("[data-scroll-container]");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Box
      data-scroll-container
      sx={{
        height: { xs: "100dvh", md: "100vh" },
        overflowY: "auto",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
        width: "100vw",
        maxWidth: "100vw",
        position: "relative",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          scrollSnapAlign: "start",
          "&::before": {
            content: '""',
            position: "fixed",
            top: "calc(-250px + var(--scroll-progress, 0) * 100vh)",
            right: "calc(-250px + var(--scroll-progress, 0) * -100vw)",
            width: { md: "1400px", xs: "1000px" },
            height: "1400px",
            background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 1,
            transition: "all 0.3s ease-out",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
            <IconButton
              onClick={() => (window.location.hash = "#/")}
              sx={{
                color: colors.accent,
                backgroundColor: colors.background.light + "80",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: colors.accent + "20",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "6rem" },
              fontWeight: "bold",
              textAlign: "center",
              mb: { xs: 2, md: 3 },
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
            }}
          >
            {"Who are we?"}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              color: colors.secondary,
              maxWidth: { xs: "90%", md: "700px" },
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              px: { xs: 2, md: 0 },
              lineHeight: { xs: 1.4, md: 1 },
            }}
          >
            We are an international team of 5 professionals, with the majority
            of us working in Tech in one or the other way. Some of us knew each
            other from before, some met through the Project.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              color: colors.secondary,
              maxWidth: { xs: "90%", md: "700px" },
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              px: { xs: 2, md: 0 },
              lineHeight: { xs: 1.4, md: 1 },
            }}
          >
            For most of us the Project is what you could consider a side hustle,
            which comes to show that we are extremely passionate about trying
            this out. Call us dreamers, but we truly believe that if we get this
            thing to work, it would be - if nothing else - unprecedented in
            human history.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              color: colors.secondary,
              maxWidth: { xs: "90%", md: "700px" },
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              px: { xs: 2, md: 0 },
              lineHeight: { xs: 1.4, md: 1 },
            }}
          >
            It is an attempt to reject the questionable idea of necessary
            competition and replace it with what appears to us like common
            sense: we are only strong in numbers. Modern technology allows us to
            collaborate on a scale we haven't even scratched the surface of.
            Instead, the digital space is increasingly becoming a mirror of what
            the real world already seems to be: you cannot move anywhere without
            paying for it. We think it's time to start scratching.
          </Typography>
        </motion.div>
      </Box>

      {/* Team Members Section */}
      {teamMembers.map((member) => (
        <Box
          key={member.id}
          sx={{
            height: { xs: "100dvh", md: "100vh" },
            display: "flex",
            alignItems: "center",
            scrollSnapAlign: "start",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${colors.background.medium} 0%, ${colors.background.dark} 100%)`,
              pointerEvents: "none",
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ width: "100%", position: "relative", zIndex: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: member.id % 2 === 0 ? "row-reverse" : "row",
                },
                alignItems: "center",
                gap: { xs: 3, md: 8 },
                height: "100%",
                py: { xs: 2, md: 4 },
                px: { xs: 2, md: 0 },
              }}
            >
              {/* Portrait Side */}
              <motion.div
                initial={{ opacity: 0, x: member.id % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ margin: "-100px" }}
                style={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "150px", sm: "180px", md: "300px" },
                    height: { xs: "150px", sm: "180px", md: "300px" },
                    mx: "auto",
                    mb: { xs: 2, md: 0 },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: { xs: "-10px", md: "-20px" },
                      left: { xs: "-10px", md: "-20px" },
                      right: { xs: "-10px", md: "-20px" },
                      bottom: { xs: "-10px", md: "-20px" },
                      background: `linear-gradient(45deg, ${colors.accent}40, ${colors.highlight}40)`,
                      borderRadius: "50%",
                      filter: "blur(20px)",
                      opacity: 0.6,
                    },
                  }}
                >
                  <Avatar
                    src={member.image}
                    sx={{
                      width: "100%",
                      height: "100%",
                      border: `4px solid ${colors.accent}`,
                      boxShadow: `0 0 30px ${colors.accent}40`,
                    }}
                  />
                </Box>
              </motion.div>

              {/* Bio Side */}
              <motion.div
                initial={{ opacity: 0, x: member.id % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ margin: "-100px" }}
                style={{
                  position: "relative",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: colors.background.light + "90",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${colors.accent}20`,
                    borderRadius: 3,
                    p: { xs: 2, md: 4 },
                    boxShadow: `0 8px 32px ${colors.background.dark}40`,
                    width: "100%",
                    maxWidth: { xs: "100%", md: "500px" },
                    mx: { xs: 1, md: 0 },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        color:
                          currentTheme === "darknight"
                            ? colors.textColorLight
                            : colors.textColorDark,
                        fontWeight: "bold",
                        mb: 1,
                        fontSize: { xs: "1.5rem", md: "2.125rem" },
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.accent,
                        fontWeight: "bold",
                        mb: 1,
                        fontSize: { xs: "1rem", md: "1.25rem" },
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.secondary,
                        fontWeight: "medium",
                        mb: 3,
                        fontStyle: "italic",
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {member.username}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.secondary,
                        lineHeight: 1.8,
                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                        mb: 3,
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {member.bio}
                    </Typography>

                    {/* Social Links */}
                    <Box sx={{ 
                      display: "flex", 
                      gap: 2, 
                      justifyContent: { xs: "center", md: "flex-start" },
                      flexWrap: "wrap"
                    }}>
                      {member.social.linkedin && (
                        <IconButton
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: colors.accent,
                            "&:hover": {
                              backgroundColor: colors.accent + "20",
                            },
                          }}
                        >
                          <LinkedIn />
                        </IconButton>
                      )}
                      {member.social.twitter && (
                        <IconButton
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: colors.accent,
                            "&:hover": {
                              backgroundColor: colors.accent + "20",
                            },
                          }}
                        >
                          <Twitter />
                        </IconButton>
                      )}
                      {member.social.github && (
                        <IconButton
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: colors.accent,
                            "&:hover": {
                              backgroundColor: colors.accent + "20",
                            },
                          }}
                        >
                          <GitHub />
                        </IconButton>
                      )}
                      {member.social.email && (
                        <IconButton
                          href={`mailto:${member.social.email}`}
                          sx={{
                            color: colors.accent,
                            "&:hover": {
                              backgroundColor: colors.accent + "20",
                            },
                          }}
                        >
                          <Email />
                        </IconButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Container>
        </Box>
      ))}

      {/* Mission Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: "flex",
          alignItems: "center",
          scrollSnapAlign: "start",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 100%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, px: { xs: 2, md: 0 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ margin: "-100px" }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: 4,
                fontWeight: "bold",
                fontSize: { xs: "2rem", md: "3rem" },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              You want to contribute?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: colors.secondary,
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.3rem" },
                maxWidth: "800px",
                mx: "auto",
                mb: 4,
                px: { xs: 1, md: 0 },
              }}
            >
              There is many ways in which you can contribute to the Project.
              Obviously developers are always welcome to contribute code, but
              you could also help us by spreading the word, by generating
              traffic, by sharing your ideas or by simply being a part of the
              community. If you don't want to sign up, you can also send us an
              email of course:
            </Typography>

            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              mt: 3,
              px: { xs: 2, md: 0 }
            }}>
              <Button
                variant="contained"
                size="large"
                href="mailto:contact@ubuntu-project.com"
                startIcon={<Email />}
                sx={{
                  backgroundColor: colors.accent,
                  color: colors.textColorLight,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: 3,
                  fontWeight: "bold",
                  textAlign: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 15px ${colors.accent}40`,
                  "&:hover": {
                    backgroundColor: colors.highlight,
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 20px ${colors.accent}60`,
                  },
                  transition: "all 0.3s ease",
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "100%", sm: "none" },
                }}
              >
                contact@ubuntu-project.com
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;
