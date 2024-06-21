import { ISubject } from "@/models/interfaces/subjectInterface";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDotCircle } from "react-icons/fa";
import { IoSettings, IoWarning } from "react-icons/io5";
import ActivateSubjectModal from "../modals/materias/ActivateSubject";
import ArchiveSubjectModal from "../modals/materias/ArchiveSubject";
import EditMateriasModal from "../modals/materias/EditMateriasModal";

interface SubjectAccordionItemProps {
  subject: ISubject;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getSubjects: Function;
}

export default function SubjectAccordionItem({
  subject,
  setIsLoading,
  getSubjects,
}: SubjectAccordionItemProps) {
  const panelBg = useColorModeValue("gray.100", "green.700");

  const renderEmptyState = (message: string) => (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      color="gray.400"
    >
      <IoWarning size={40} />
      <Text mt={2}>{message}</Text>
    </Flex>
  );

  return (
    <AccordionItem
      key={subject.name}
      borderBottom={"2px"}
      borderBottomColor={"green.500"}
    >
      {/* // -------- BOTON DE LA MATERIA -------- // */}
      <AccordionButton>
        <Flex alignItems={"center"} as="span" flex="1" textAlign="left" gap={2}>
          <Box color={"green.500"}>
            <FaDotCircle />
          </Box>
          {/* // -------- NOMBRE DE LA MATERIA -------- // */}
          <Heading fontSize={"xl"}>{convertToTitleCase(subject.name)}</Heading>
          {/* // -------- CLAVE DE LA MATERIA -------- // */}
          <>
            <Box className="vertical-separator-char" as="span" fontSize={"lg"}>
              |
            </Box>
            <span
              style={{
                color: "gray",
                fontSize: "sm",
                fontWeight: "bold",
              }}
            >
              {subject.key}
            </span>
            {/* // -------- HORAS PROGRAMADAS -------- // */}

            {subject.active ? (
              <Badge colorScheme="green">
                {subject.scheduledHours} horas programadas
              </Badge>
            ) : (
              <Badge colorScheme="red">
                {subject.scheduledHours} horas programadas
              </Badge>
            )}
          </>
        </Flex>
        {/* // -------- BOTON DE OPCIONES -------- // */}
        <Menu autoSelect={false}>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<IoSettings />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            colorScheme="green"
          />
          {/* // -------- LISTA DE OPCIONES -------- // */}
          <MenuList>
            {/* // -------- EDITAR MATERIA -------- // */}
            <EditMateriasModal
              subject={subject}
              setIsLoading={setIsLoading}
              refreshTable={getSubjects}
            />
            <MenuDivider />
            {/* // -------- ARCHIVAR MATERIA -------- // */}
            {subject.active ? (
              <ArchiveSubjectModal
                subject={subject}
                setIsLoading={setIsLoading}
                refreshTable={getSubjects}
              />
            ) : (
              <ActivateSubjectModal
                subject={subject}
                setIsLoading={setIsLoading}
                refreshTable={getSubjects}
              />
            )}
          </MenuList>
        </Menu>
      </AccordionButton>
      <AccordionPanel bg={panelBg} p={4} borderRadius="md">
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {/* // -------- PRIMERA COLUMNA (INFORMACIÓN DE LA MATERIA) -------- // */}
          <GridItem minW={"40vh"}>
            <Stack spacing={3}>
              <Box
                p={3}
                bg="white"
                borderRadius="md"
                shadow="md"
                height="40vh"
                display="flex"
                flexDirection="column"
              >
                <Text fontSize={"2xl"} as={"b"} mb={3}>
                  Información de la materia
                </Text>
                <Divider />
                <Box overflowY="auto" flex="1" mt={3} fontSize={"large"}>
                  <Text>
                    <strong>Nombre corto:</strong> {subject.shortName}
                  </Text>
                  <Text>
                    <strong>Metodología:</strong> {subject.methodology}
                  </Text>
                  <Text>
                    <strong>Descripción:</strong> {subject.description}
                  </Text>
                  <Text>
                    <strong>Periodo:</strong> {subject.period}
                  </Text>

                  <Text>
                    <strong>Créditos:</strong> {subject.credits}
                  </Text>
                  <Text>
                    <strong>Área de conocimiento:</strong> {subject.expertise}
                  </Text>
                  <Text>
                    <strong>Fórmula:</strong> {subject.formula}
                  </Text>
                </Box>
              </Box>
            </Stack>
          </GridItem>
          {/* // -------- SEGUNDA COLUMNA (PLANES DE ESTUDIO) -------- // */}
          <GridItem minW={"40vh"}>
            <Stack spacing={3}>
              <Box
                p={3}
                bg="white"
                borderRadius="md"
                shadow="md"
                height="40vh"
                display="flex"
                flexDirection="column"
              >
                <Text fontSize={"2xl"} as={"b"} mb={3}>
                  Planes de estudio
                </Text>
                <Divider />
                <Box overflowY="auto" flex="1">
                  {subject.studyPlans && subject.studyPlans.length > 0
                    ? subject.studyPlans.map((plan, index) => (
                        <Text key={index}>{plan}</Text>
                      ))
                    : renderEmptyState("No hay planes de estudio.")}
                </Box>
              </Box>
            </Stack>
          </GridItem>
          {/* // -------- TERCERA COLUMNA (CURSOS INSTANCIADOS EN LA MATERIA) -------- // */}
          <GridItem minW="40vh">
            <Stack spacing={3}>
              <Box
                p={3}
                bg="white"
                borderRadius="md"
                shadow="md"
                height="40vh"
                display="flex"
                flexDirection="column"
              >
                <Text fontSize={"2xl"} as={"b"} mb={3}>
                  Cursos instanciados
                </Text>
                <Divider />
                <Box overflowY="auto" flex="1">
                  {subject.courses && subject.courses.length > 0
                    ? subject.courses.map((course, index) => (
                        <Text key={index}>{course}</Text>
                      ))
                    : renderEmptyState("No hay cursos instanciados.")}
                </Box>
              </Box>
            </Stack>
          </GridItem>
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
}
