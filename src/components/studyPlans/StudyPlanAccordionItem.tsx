import { IStudyPlan } from "@/models/interfaces/studyPlanInterface";
import { ISubject } from "@/models/interfaces/subjectInterface";
import { numberToString } from "@/utils/numberToString";
import { periodDenominationConverter } from "@/utils/periodDenominationConverter";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaDotCircle } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import AssignSubjectModal from "../modals/studyPlans/AssignSubjectModal";
import ChangeStudyPlanStatusModal from "../modals/studyPlans/ChangeStudyPlanStatusModal";
import EditStudyPlanModal from "../modals/studyPlans/EditStudyPlanModal";

interface StudyPlanAccordionItemProps {
  career: ICareer;
  studyPlan: IStudyPlan;
  getStudyPlans: Function;
  setIsLoading: Function;
}

const defaultIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function StudyPlanAccordionItem({
  career,
  studyPlan,
  getStudyPlans,
  setIsLoading,
}: StudyPlanAccordionItemProps) {
  const [reactiveStudyPlan, setReactiveStudyPlan] =
    useState<IStudyPlan>(studyPlan);
  const [periods, setPeriods] = useState<number[]>([]);

  // -------- RECARGAR PLAN DE ESTUDIO -------- //
  const reloadStudyPlan = async () => {
    try {
      const res = await fetch(
        `/api/studyPlans/${studyPlan._id}?populate_subjects=true`
      );

      const data = await res.json();

      setReactiveStudyPlan(data.studyPlan);
    } catch (error) {
      console.error(error);
    }
  };

  // -------- OBTENER PERIODO MÁS ALTO DE MATERIAS ASIGNADAS -------- //
  const getHigherPeriod = () => {
    if (!reactiveStudyPlan.subjects) return 0;

    const periods = reactiveStudyPlan.subjects.map(
      (subject: ISubject | string) => {
        if (typeof subject === "string") return 0;

        return subject.period;
      }
    );

    const max = Math.max(...periods);

    setPeriods(Array.from({ length: max }, (_, i) => i + 1));
  };

  useEffect(() => {
    getHigherPeriod();
  }, [reactiveStudyPlan.subjects]);

  return (
    <AccordionItem key={reactiveStudyPlan._id}>
      <AccordionButton>
        <Flex alignItems={"center"} as="span" flex="1" textAlign="left" gap={2}>
          <Box color={reactiveStudyPlan.active ? "green.500" : "red.500"}>
            <FaDotCircle />
          </Box>

          {/* // -------- NOMBRE DEL PLAN DE ESTUDIO -------- // */}
          <Heading fontSize={"xl"}>
            {convertToTitleCase(reactiveStudyPlan.name)}
          </Heading>

          <Box className="vertical-separator-char" as="span" fontSize={"lg"}>
            |
          </Box>
          {/* // -------- CODIGO DEL PLAN DE ESTUDIO -------- // */}
          <Box color={"gray.400"} fontSize={"sm"} fontWeight={"bold"}>
            <em>{reactiveStudyPlan.code}</em>
          </Box>

          {/* // -------- CANTIDAD DE MATERIAS ASIGNADAS -------- // */}
          <Badge ms={2} colorScheme="purple">
            {reactiveStudyPlan.subjects ? reactiveStudyPlan.subjects.length : 0}{" "}
            materias asignadas
          </Badge>
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
            variant={"outline"}
          />

          {/* // -------- LISTA DE OPCIONES -------- // */}
          <MenuList>
            {/* // -------- OPCION DE EDITAR PLAN DE ESTUDIO -------- // */}
            <EditStudyPlanModal
              career={career}
              studyPlan={reactiveStudyPlan}
              getStudyPlans={reloadStudyPlan}
              setIsLoading={setIsLoading}
            />

            {/* // -------- OPCION DE ASIGNAR MATERIA -------- // */}
            <AssignSubjectModal
              studyPlan={reactiveStudyPlan}
              reloadStudyPlan={reloadStudyPlan}
            />

            <MenuDivider borderColor={"green.100"} />

            {/* // -------- OPCION DE CAMBIAR ESTADO DE PLAN DE ESTUDIO -------- // */}
            {reactiveStudyPlan.active ? (
              <ChangeStudyPlanStatusModal
                career={career}
                studyPlan={reactiveStudyPlan}
                getStudyPlans={getStudyPlans}
                setIsLoading={setIsLoading}
                action={"archive"}
              />
            ) : (
              <ChangeStudyPlanStatusModal
                career={career}
                studyPlan={reactiveStudyPlan}
                getStudyPlans={getStudyPlans}
                setIsLoading={setIsLoading}
                action={"restore"}
              />
            )}
          </MenuList>
        </Menu>
      </AccordionButton>

      <AccordionPanel py={0} px={6}>
        {/* // -------- LISTA DE MATERIAS POR PERIODO -------- // */}
        <Accordion allowMultiple={true} defaultIndex={defaultIndexes}>
          {periods.map((period) => (
            <AccordionItem
              borderTop={"none"}
              borderBottom={"2px dashed"}
              borderBottomColor={"gray.200"}
            >
              {/* // -------- ENCABEZADO DE PERIODO -------- // */}
              <AccordionButton py={4}>
                <Flex
                  alignItems={"center"}
                  as="span"
                  flex="1"
                  textAlign="left"
                  gap={2}
                >
                  {/* // -------- ICONO DE PERIODO -------- // */}
                  <Flex
                    w={"20px"}
                    h={"20px"}
                    pb={"1px"}
                    bg={"green.500"}
                    color={"white"}
                    justify={"center"}
                    align={"center"}
                    borderRadius={"full"}
                    fontWeight={"bold"}
                    fontSize={"xs"}
                    boxShadow={"lg"}
                  >
                    {period}
                  </Flex>

                  {/* // -------- TITULO DE PERIODO -------- // */}
                  <Heading fontSize={"xl"} fontWeight={"semibold"}>
                    {numberToString(period)}{" "}
                    {periodDenominationConverter(studyPlan.periodDenomination)}
                  </Heading>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              {/* // -------- MATERIAS DEL PERIODO -------- // */}
              <AccordionPanel py={0} px={6} bg={"gray.50"}>
                {reactiveStudyPlan.subjects &&
                  reactiveStudyPlan.subjects.length > 0 && (
                    <Box
                      display={"grid"}
                      gridTemplateColumns={
                        "repeat(auto-fill, minmax(250px, 1fr))"
                      }
                      gap={4}
                    >
                      {reactiveStudyPlan.subjects.map(
                        (subject: ISubject | string) => {
                          if (typeof subject === "string") return null;

                          if (subject.period == period) {
                            return (
                              <Box
                                key={subject._id}
                                my={4}
                                p={4}
                                borderRadius={"md"}
                                boxShadow={"md"}
                                bg={"white"}
                                cursor={"pointer"}
                                userSelect={"none"}
                                transition={"all 0.2s ease-in-out"}
                                _hover={{
                                  transform: "scale(1.02)",
                                  boxShadow: "lg",
                                }}
                              >
                                {/* // -------- NOMBRE DE LA MATERIA -------- // */}
                                <Heading fontSize={"md"}>
                                  {convertToTitleCase(subject.name)}
                                </Heading>

                                {/* // -------- CODIGO DE LA MATERIA -------- // */}
                                <Badge mt={2} colorScheme="purple">
                                  {subject.key}
                                </Badge>
                              </Box>
                            );
                          }
                        }
                      )}
                    </Box>
                  )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </AccordionPanel>
    </AccordionItem>
  );
}
