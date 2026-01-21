import {
  Box,
  Heading,
  Textarea,
  Button,
  Text,
  VStack,
  HStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import bgdash from "../assets/back13.jpg";

function DashboardPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Appel IA
  const handleAsk = async (customQuestion) => {
    const q = customQuestion || question;
    if (!q) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/ai/bi-insights",
        { question: q }
      );
      setAnswer(res.data.insight);
    } catch (err) {
      setAnswer("❌ Erreur : IA indisponible");
    }
    setLoading(false);
  };

  return (
    <Box minH="100vh" pt="80px">
      {/* 🌄 Background */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={-1}
        backgroundImage={`url(${bgdash})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="brightness(0.6)"
      />

      {/* 🖥️ Power BI plein écran */}
      <Box position="relative" w="100%" h="calc(100vh - 80px)">
        <iframe
          title="locationTerrain"
          src="https://app.powerbi.com/view?r=eyJrIjoiZDU2ZmMxYWUtYTJiMi00ZWNkLWFjMDEtZDZjZmEzODUyNThkIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen
        />

        {/* 🤖 Bouton IA flottant */}
        <Button
          position="fixed"
          bottom="30px"
          right="30px"
          colorScheme="teal"
          size="lg"
          borderRadius="full"
          boxShadow="2xl"
          onClick={onOpen}
        >
          🤖 Assistant IA
        </Button>
      </Box>

      {/* 🧠 Drawer IA */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Assistant décisionnel IA</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Textarea
                placeholder="Exemple : Quel sport génère le plus de revenus ?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <Button
                colorScheme="teal"
                onClick={() => handleAsk()}
                isLoading={loading}
              >
                Envoyer
              </Button>

              {/* ⚡ Questions rapides */}
              <HStack spacing={2} wrap="wrap">
                <Button
                  size="sm"
                  onClick={() =>
                    handleAsk("Quel est le sport le plus réservé ?")
                  }
                >
                  Top sport
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    handleAsk("Quel est le revenu total ?")
                  }
                >
                  Revenu total
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    handleAsk("Y a-t-il une baisse d'activité récente ?")
                  }
                >
                  Tendance
                </Button>
              </HStack>

              {/* 📝 Réponse IA */}
              {answer && (
                <Box p={4} bg="gray.100" borderRadius="md">
                  <Text whiteSpace="pre-wrap">{answer}</Text>
                </Box>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default DashboardPage;
